$ErrorActionPreference = "Stop"
$base = "http://localhost:8080"

Write-Host "=== Login ==="
$login = Invoke-RestMethod -Uri "$base/api/auth/login" -Method Post -ContentType "application/json" `
  -Body '{"email":"demo@nettopo.com","password":"demo123"}'
$headers = @{ Authorization = "Bearer $($login.token)" }

$body = @{
  topologyName = "API Test Topology"
  nodesJson    = '[{"id":"n1","type":"device","position":{"x":0,"y":0},"data":{"label":"PC1","deviceType":"pc","ipAddress":"192.168.1.10","subnetMask":"255.255.255.0","gateway":"192.168.1.1","status":"active"}}]'
  edgesJson    = "[]"
} | ConvertTo-Json

Write-Host "=== Save (POST) ==="
$saved = Invoke-RestMethod -Uri "$base/api/topologies" -Method Post -Headers $headers -ContentType "application/json" -Body $body
Write-Host "Saved id: $($saved.id) name: $($saved.topologyName)"

Write-Host "=== List (GET) ==="
$list = @(Invoke-RestMethod -Uri "$base/api/topologies" -Headers $headers)
Write-Host "Count: $($list.Count)"

Write-Host "=== Load (GET by id) ==="
$loaded = Invoke-RestMethod -Uri "$base/api/topologies/$($saved.id)" -Headers $headers
Write-Host "Loaded name: $($loaded.topologyName) nodesJson chars: $($loaded.nodesJson.Length)"

Write-Host "=== OK ==="
