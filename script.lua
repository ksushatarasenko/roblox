local portal = script.Parent
local target = workspace:WaitForChild("Target")

portal.Touched:Connect(function(hit)
    local root = hit.Parent:FindFirstChild("HumanoidRootPart")
    if root then
        root.CFrame = target.CFrame + Vector3.new(0, 3, 0)
    end
end)







  



































