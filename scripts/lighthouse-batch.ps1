param(
    [string]$BaseUrl = "http://localhost:3000",
    [int]$Runs = 3,
    [string]$OutRoot = "lighthouse-reports",
    [string[]]$Paths = @("/", "/checkout", "/producto/test")
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

function To-Slug {
    param([string]$Value)
    if ($Value -eq "/") { return "home" }
    return ($Value.Trim("/") -replace "[^a-zA-Z0-9]+", "-").ToLowerInvariant()
}

function To-SecString {
    param([double]$Ms)
    return ("{0:N2}s" -f ($Ms / 1000.0))
}

function To-MsString {
    param([double]$Ms)
    return ("{0:N0}ms" -f $Ms)
}

function Test-UrlReachable {
    param([string]$Url)
    try {
        $response = Invoke-WebRequest -Uri $Url -Method Head -TimeoutSec 10 -UseBasicParsing
        return ($response.StatusCode -ge 200 -and $response.StatusCode -lt 500)
    } catch {
        return $false
    }
}

$timestamp = Get-Date -Format "yyyyMMdd-HHmmss"
$outDir = Join-Path $OutRoot $timestamp
New-Item -ItemType Directory -Path $outDir -Force | Out-Null

$results = @()
$profiles = @(
    @{ label = "desktop"; cliPreset = "desktop" },
    @{ label = "mobile"; cliPreset = "perf" }
)

Write-Host "Running Lighthouse batch..."
Write-Host "Base URL: $BaseUrl"
Write-Host "Runs per URL/preset: $Runs"
Write-Host "Output dir: $outDir"

if (-not (Test-UrlReachable -Url $BaseUrl)) {
    throw "Base URL no responde: $BaseUrl. Iniciá el frontend en otra terminal con 'npm run start' y dejalo corriendo."
}

foreach ($profile in $profiles) {
    $preset = [string]$profile.label
    $cliPreset = [string]$profile.cliPreset
    foreach ($path in $Paths) {
        $url = "{0}{1}" -f $BaseUrl.TrimEnd("/"), $path
        $slug = To-Slug $path

        for ($run = 1; $run -le $Runs; $run++) {
            $jsonFile = Join-Path $outDir ("{0}_{1}_run{2}.json" -f $preset, $slug, $run)

            Write-Host ("-> {0} ({1}) | {2} | run {3}" -f $preset.ToUpperInvariant(), $cliPreset, $url, $run)

            $lhArgs = @(
                "lighthouse",
                $url,
                "--only-categories=performance",
                "--preset=$cliPreset",
                "--output=json",
                "--output-path=$jsonFile",
                "--quiet",
                "--chrome-flags=--headless=new --ignore-certificate-errors --allow-insecure-localhost --no-sandbox --disable-dev-shm-usage"
            )
            & npx @lhArgs

            if ($LASTEXITCODE -ne 0) {
                throw "Lighthouse failed for $url ($preset run $run)."
            }

            $report = Get-Content -LiteralPath $jsonFile -Raw -Encoding UTF8 | ConvertFrom-Json
            $results += [pscustomobject]@{
                preset = $preset
                path = $path
                url = $url
                run = $run
                performance = [double]$report.categories.performance.score * 100.0
                fcpMs = [double]$report.audits.'first-contentful-paint'.numericValue
                lcpMs = [double]$report.audits.'largest-contentful-paint'.numericValue
                siMs = [double]$report.audits.'speed-index'.numericValue
                tbtMs = [double]$report.audits.'total-blocking-time'.numericValue
                cls = [double]$report.audits.'cumulative-layout-shift'.numericValue
            }
        }
    }
}

$summary = $results |
    Group-Object -Property preset, path |
    ForEach-Object {
        $rows = $_.Group
        [pscustomobject]@{
            preset = $rows[0].preset
            path = $rows[0].path
            runs = $rows.Count
            performance = [math]::Round((($rows | Measure-Object -Property performance -Average).Average), 1)
            fcpMs = [math]::Round((($rows | Measure-Object -Property fcpMs -Average).Average), 1)
            lcpMs = [math]::Round((($rows | Measure-Object -Property lcpMs -Average).Average), 1)
            siMs = [math]::Round((($rows | Measure-Object -Property siMs -Average).Average), 1)
            tbtMs = [math]::Round((($rows | Measure-Object -Property tbtMs -Average).Average), 1)
            cls = [math]::Round((($rows | Measure-Object -Property cls -Average).Average), 3)
        }
    } |
    Sort-Object preset, path

$summaryJsonPath = Join-Path $outDir "summary.json"
$summary | ConvertTo-Json -Depth 4 | Set-Content -LiteralPath $summaryJsonPath -Encoding UTF8

$summaryMdPath = Join-Path $outDir "summary.md"
$lines = @()
$lines += "# Lighthouse Summary"
$lines += ""
$lines += ('- Base URL: `{0}`' -f $BaseUrl)
$lines += "- Runs: $Runs"
$lines += "- Generated: $(Get-Date -Format "yyyy-MM-dd HH:mm:ss")"
$lines += ""
$lines += "| Preset | Path | Perf | FCP | LCP | SI | TBT | CLS |"
$lines += "|---|---|---:|---:|---:|---:|---:|---:|"
foreach ($row in $summary) {
    $lines += ('| {0} | `{1}` | {2} | {3} | {4} | {5} | {6} | {7} |' -f `
        $row.preset, `
        $row.path, `
        $row.performance, `
        (To-SecString $row.fcpMs), `
        (To-SecString $row.lcpMs), `
        (To-SecString $row.siMs), `
        (To-MsString $row.tbtMs), `
        $row.cls)
}

Set-Content -LiteralPath $summaryMdPath -Value ($lines -join [Environment]::NewLine) -Encoding UTF8

Write-Host ""
Write-Host "Done."
Write-Host "Summary JSON: $summaryJsonPath"
Write-Host "Summary MD:   $summaryMdPath"
