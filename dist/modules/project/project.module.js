"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectModule = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const farm_entity_1 = require("../farm/farm.entity");
const user_entity_1 = require("../user/user.entity");
const user_project_entity_1 = require("../user-project/user-project.entity");
const project_controller_1 = require("./project.controller");
const project_entity_1 = require("./project.entity");
const project_service_1 = require("./project.service");
let ProjectModule = class ProjectModule {
};
exports.ProjectModule = ProjectModule;
exports.ProjectModule = ProjectModule = tslib_1.__decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([
                project_entity_1.ProjectEntity,
                user_entity_1.UserEntity,
                user_project_entity_1.UserProjectEntity,
                farm_entity_1.FarmEntity,
            ]),
        ],
        controllers: [project_controller_1.ProjectController],
        exports: [project_service_1.ProjectService],
        providers: [project_service_1.ProjectService],
    })
], ProjectModule);
//# sourceMappingURL=project.module.js.map