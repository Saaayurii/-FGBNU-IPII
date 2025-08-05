export const welcomeEmailTemplate = (subscriberEmail: string) => `
<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Добро пожаловать в нашу рассылку!</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
        }
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 30px 20px;
            text-align: center;
            border-radius: 8px 8px 0 0;
        }
        .content {
            background: #f8f9fa;
            padding: 30px 20px;
            border-radius: 0 0 8px 8px;
        }
        .footer {
            text-align: center;
            margin-top: 20px;
            padding: 20px;
            font-size: 14px;
            color: #666;
        }
        .button {
            display: inline-block;
            background: #667eea;
            color: white;
            padding: 12px 24px;
            text-decoration: none;
            border-radius: 6px;
            margin: 20px 0;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>Добро пожаловать в нашу рассылку!</h1>
        <p>Спасибо, что подписались на наши новости и обновления.</p>
    </div>
    
    <div class="content">
        <p>Здравствуйте!</p>
        
        <p>Вы успешно подписались на нашу рассылку новостей. Вот что вы получите:</p>
        
        <ul>
            <li>Свежие новости и обновления</li>
            <li>Полезные статьи и советы</li>
            <li>Эксклюзивные предложения и акции</li>
            <li>Приглашения на мероприятия и вебинары</li>
        </ul>
        
        <p>Если у вас возникнут вопросы или пожелания, вы всегда можете связаться с нами.</p>
        
        <a href="${process.env.NEXTAUTH_URL || 'http://localhost:3000'}" class="button">
            Перейти на сайт
        </a>
    </div>
    
    <div class="footer">
        <p>С уважением,<br>Команда рассылки</p>
        <p><small>Вы получили это письмо, так как подписались на нашу рассылку. Если это была ошибка, просто проигнорируйте это письмо.</small></p>
    </div>
</body>
</html>
`;

export const newsNotificationTemplate = (
  subscriberEmail: string,
  postTitle: string,
  postDescription: string,
  postSlug: string
) => `
<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Новая публикация: ${postTitle}</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
        }
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 30px 20px;
            text-align: center;
            border-radius: 8px 8px 0 0;
        }
        .content {
            background: #f8f9fa;
            padding: 30px 20px;
            border-radius: 0 0 8px 8px;
        }
        .footer {
            text-align: center;
            margin-top: 20px;
            padding: 20px;
            font-size: 14px;
            color: #666;
        }
        .button {
            display: inline-block;
            background: #667eea;
            color: white;
            padding: 12px 24px;
            text-decoration: none;
            border-radius: 6px;
            margin: 20px 0;
        }
        .post-preview {
            background: white;
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
            border: 1px solid #e9ecef;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>Новая публикация на сайте</h1>
        <p>Узнайте последние новости и обновления от нашей команды.</p>
    </div>
    
    <div class="content">
        <p>Здравствуйте!</p>
        
        <p>Мы опубликовали новую статью, которая может вас заинтересовать:</p>
        
        <div class="post-preview">
            <h2>${postTitle}</h2>
            <p>${postDescription}</p>
        </div>
        
        <a href="${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/news/${postSlug}" class="button">
            Читать статью
        </a>
    </div>
    
    <div class="footer">
        <p>С уважением,<br>Команда рассылки</p>
        <p><small>Вы получили это письмо, так как подписались на нашу рассылку. Если это была ошибка, просто проигнорируйте это письмо.</small></p>
    </div>
</body>
</html>
`;

export const unsubscribeEmailTemplate = (subscriberEmail: string) => `
<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Вы отписались от рассылки</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
        }
        .header {
            background: #6c757d;
            color: white;
            padding: 30px 20px;
            text-align: center;
            border-radius: 8px 8px 0 0;
        }
        .content {
            background: #f8f9fa;
            padding: 30px 20px;
            border-radius: 0 0 8px 8px;
        }
        .footer {
            text-align: center;
            margin-top: 20px;
            padding: 20px;
            font-size: 14px;
            color: #666;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>Вы отписались от рассылки</h1>
        <p>Подписка на нашу рассылку успешно отменена.</p>
    </div>
    
    <div class="content">
        <p>Если это была ошибка, вы всегда можете подписаться снова.</p>
        
        <p>Спасибо, что были с нами!</p>
    </div>
    
    <div class="footer">
        <p>С уважением,<br>Команда рассылки</p>
    </div>
</body>
</html>
`;
