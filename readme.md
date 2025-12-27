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
        title: "🔥 Что теперь умеет MegaTrap V2?"
        headers: ["Механика", "Описание"]
        rows:
          - ["✨ Плавно мигает", "Светится красивой анимацией"]
          - ["💀 Наносит урон", "Только когда красный"]
          - ["💥 Взрыв искр", "При активации"]
          - ["🔊 Реалистичный звук", "Бум! Трах! Вжух!"]
          - ["🚀 Подбрасывает вверх", "Сильнее, чем версия V1"]
          - ["🧨 Падает вниз", "Как collapsing floor"]
          - ["🌫 С дымом", "Выглядит очень эффектно"]
          - ["♻️ Возвращается", "И готова снова ловить"]
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



- type: "gallery"
  title: "Примеры Obby"
  images:
    - src: "assets/images/obby-1.png"
            caption: "Начало Obby"
    - src: "assets/images/obby-2.png"
            caption: "Сложный уровень"
          - src: "assets/images/obby-3.png"
            caption: ""


  - type: "oneImage"
        title: "Заголовок"
        textTop: "Текст над картинкой"
        img:
            src: "/assets/images/pic.png"
            width: 360
            maxWidth: "100%"
            align: center
        textBottom: "Текст под картинкой"


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