import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { ROLES_KEY } from "../decorators/roles.decorators";

@Injectable()
export class RolesGuard implements CanActivate{
    constructor(private reflector:Reflector){}

    canActivate(context: ExecutionContext): boolean {
        const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY,[
            context.getHandler(),
            context.getClass()
        ]);

        console.log("required roles",requiredRoles);
        
        if(!requiredRoles) return true;

        const {user} = context.switchToHttp().getRequest();
        console.log('User from request:', user);
        if (!user) {
            console.log('No user found in the request');
            return false;
          }

          console.log('User roles:', user.role);
        
        return requiredRoles.some(role => role=== user.role)
    }
}