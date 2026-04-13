$files = @(
    'src\app\pages\modules\Roles.tsx',
    'src\app\pages\modules\SecurityAccessGroup.tsx'
)

foreach ($file in $files) {
    $content = Get-Content $file -Raw -Encoding UTF8
    $content = $content.Replace('variant="primary"', 'variant="default"')
    Set-Content $file $content -Encoding UTF8 -NoNewline
    Write-Host "Fixed: $file"
}
