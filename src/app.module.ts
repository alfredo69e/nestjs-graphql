import { Module, Logger } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver } from '@nestjs/apollo';
import { join } from 'path';
import { ApolloServerPluginLandingPageLocalDefault } from 'apollo-server-core';
import { ItemsModule } from './items/items.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EnvConfiguration, JoiValidationSchema } from './config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { JwtService } from '@nestjs/jwt';
import { SeedModule } from './seed/seed.module';

@Module({
  imports: [ 
    ConfigModule.forRoot({
      load: [ EnvConfiguration ],
      validationSchema: JoiValidationSchema
    }),

    GraphQLModule.forRootAsync({
      driver: ApolloDriver,
      imports: [ AuthModule ],
      inject: [ JwtService ],
      useFactory: async ( jwtService: JwtService ) => ({
        autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
        playground: false,
        plugins: [
          ApolloServerPluginLandingPageLocalDefault
        ],
        context({ req }) {
          // TODO: Es Importante como esta
          // const token = req.headers.authorization?.replace('Bearer ', '');
          
          // if( !token ) throw Error(`Token Needed`);

          // const payload = jwtService.decode( token );
          // if( !payload ) throw Error(`Token not valid`);
          
        }
      })
    })
   , 
    
    TypeOrmModule.forRootAsync({
      imports: [ ConfigModule ],
      inject: [ ConfigService ],
      useFactory: ( configService: ConfigService ) =>  ({
          type: 'postgres',
          host: configService.get<string>('DB_HOST'),
          port: configService.get<number>('DB_PORT'),
          username: configService.get<string>('DB_USERNAME'),
          password: configService.get<string>('DB_PASSWORD'),
          database: configService.get<string>('DB_NAME'),
          synchronize: ( configService.get<string>('NODE_ENV').includes('dev') ) ? true : false,
          autoLoadEntities: true,
        })
    }),
    
    ItemsModule,
    
    UsersModule,
    
    AuthModule,
    
    SeedModule,
   ],
  controllers: [ ],
  providers: [ ],
})
export class AppModule {}
