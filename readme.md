Теперь мы можем использовать:
•	📘 <i class="ri-book-2-line"></i>
•	🧱 <i class="ri-cube-line"></i>
•	🧪 <i class="ri-flask-line"></i>
•	⚙️ <i class="ri-code-box-line"></i>
•	✨ <i class="ri-sparkling-2-line"></i>
•	🧠 <i class="ri-brain-line"></i>
•	🎮 <i class="ri-gamepad-line"></i>
🎯 👉 ➡️. 👁️  📍. ✔️
➡


<b></b>
<em></em>
    <span></span>
    <b style="color: blue;"></b>
    <b style=\"color: rgba(9, 167, 4, 1);\">score</b>
    <b style=\"color: rgb(255, 0, 64);\"></b>
    <b style=\"color: rgb(255, 179, 0);\"></b>
    <b style=\"color: rgba(9, 167, 4, 1);\"></b>

<ul>
  <li></li>
  <li></li>
  <li></li>
  <li></li>
</ul>

- type: codeBlock
  title: "🛠 Пример: меняем цвет куба"
  code: |
    local cube = game.Workspace.Part

    cube.Color = Color3.new(1, 0, 0)   -- красный цвет
  afterText: "Куб станет красным! ❤️"

// "note" — голубой информативный блок

// "warning" — жёлтый блок-предупреждение

- type: table
        title: "⚔️ В чём разница? (Очень простое сравнение)"
        headers: ["Кто?", "Где работает?", "Что делает?", "Пример"]
        rows:
          - ["Script", "Сервер", "Изменяет мир игры", "Открывает двери для всех"]
          - ["LocalScript", "Клиент", "Управляет игроком", "Показывает GUI только игроку"]
        afterText: |
          <b>Script</b> — директор игры,  
          <b>LocalScript</b> — личный помощник игрока.

<p class = "warzno"></p>

 - type: hint
        title: "Подсказака 👇 - 📌 Скрипт для Checkpoint2"
        code: |
          local checkpoint = script.Parent
          local respawnPoint = workspace.Spawn2  -- точка второго чекпоинта

          checkpoint.Touched:Connect(function(hit)
              local character = hit.Parent
              local humanoid = character:FindFirstChild("Humanoid")

              if humanoid then
                  local player = game.Players:GetPlayerFromCharacter(character)

                  if player then
                      player.RespawnLocation = respawnPoint
                      print("Чекпоинт 2 активирован!")

                      -- Эффект: меняем цвет на синий
                      checkpoint.Color = Color3.fromRGB(0, 100, 255)
                  end
              end
          end)

<!-- END -->
    end:
      - type: "text"
        title: "🎉 Итог: Теперь ты умеешь:"
        text: |
          <ul>
            <li>управлять движением игрока</li>
            <li>телепортировать</li>
            <li>менять скорость</li>
            <li>разворачивать игрока в пространстве</li>
            <li>использовать Humanoid и HumanoidRootPart</li>
          </ul>
          <h4>Это мощнейшая база для будущих проектов!</h4>
<!-- konec END -->