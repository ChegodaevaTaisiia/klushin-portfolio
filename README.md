# Портфолио Фёдора Клушина

Чистый HTML / CSS / JS. Без сборки.

**Дизайн-система:** Unbounded (заголовки) · Golos Text (текст) · JetBrains Mono (служебное).
Электрический ультрамарин `#2E1DF0` — единственный акцентный цвет. Тёмная и светлая
темы через `prefers-color-scheme`.

## Как смотреть

Откройте `index.html` в браузере или поднимите локальный сервер из этой папки:

```bash
python -m http.server 4599
```

Затем `http://localhost:4599`. (В Claude Code — конфиг `.claude/launch.json`, имя `portfolio`.)

## Структура

```
index.html            главная — герой, лента услуг, список работ, контакты
about.html            о себе — навыки, инструменты, опыт, резюме
contacts.html         контакты
work/<slug>.html      страницы кейсов (курированная история + архив разворотов)
css/styles.css        вся дизайн-система
js/site.js            меню, часы СПб, reveal-анимации, превью за курсором, лайтбокс
assets/cases/<slug>/  thumb.jpg, исходный PDF, pdf/*.jpg (развороты), pdf/thumbs/*.jpg
assets/resume/        резюме PDF
```

## Как добавить кейс

Страницы генерируются скриптом `tools/build_site.py` из конфигов `SITE` и `CASES`
(правьте их и запускайте `python tools/build_site.py`). Чтобы добавить проект вручную:

1. Положите развороты в `assets/cases/<slug>/pdf/` и превьюшки в `pdf/thumbs/`,
   исходный PDF — в `assets/cases/<slug>/`, обложку — `assets/cases/<slug>/thumb.jpg`.
2. Скопируйте `work/off-hours.html` в `work/<slug>.html`, замените тексты,
   пути к картинкам, блок `case-meta` и ссылку «Следующий проект».
3. Добавьте строку в `.work__list` и `.preview__fig` в `index.html`.
