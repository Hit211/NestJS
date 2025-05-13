import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: 'http://localhost:5173', // Or a list of domains like ['http://localhost:3000', 'http://example.com']
    methods: 'GET,POST,PUT,DELETE', // You can specify allowed HTTP methods
    allowedHeaders: 'Content-Type, Authorization', // Specify allowed headers
    credentials: true, // Set to true if you need to allow credentials (cookies, HTTP authentication)
  });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist:true,
      forbidNonWhitelisted:true,
      transform:true,
      disableErrorMessages:false
    })
  )

  const config = new DocumentBuilder()
    .setTitle('API Documentation')
    .setDescription('API Description')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT', // optional, for UI hints
        name: 'Authorization',
        description: 'Enter JWT token',
        in: 'header',
      },
      'access-token', // this name will be used in the @ApiBearerAuth() decorator
    )
    .build()
    const document = SwaggerModule.createDocument(app,config);
    SwaggerModule.setup('api',app,document)
  await app.listen(process.env.PORT ?? 3000);
  console.log(`app running at ${process.env.PORT}`);
  
}
bootstrap();
