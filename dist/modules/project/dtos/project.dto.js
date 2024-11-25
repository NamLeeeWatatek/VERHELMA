"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectDto = void 0;
const tslib_1 = require("tslib");
const class_validator_1 = require("class-validator");
const abstract_dto_1 = require("../../../common/dto/abstract.dto");
const project_status_enum_1 = require("../../../constants/project-status.enum");
const farm_info_dto_1 = require("../../farm/dtos/farm-info.dto");
class ProjectDto extends abstract_dto_1.AbstractDto {
    name;
    description;
    status;
    farm;
    constructor(project) {
        super(project);
        this.name = project.name;
        this.description = project.description;
        this.status = project.status;
        this.farm = project.farm ? new farm_info_dto_1.FarmInfoDto(project.farm) : undefined;
    }
}
exports.ProjectDto = ProjectDto;
tslib_1.__decorate([
    (0, class_validator_1.IsString)(),
    tslib_1.__metadata("design:type", String)
], ProjectDto.prototype, "name", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    tslib_1.__metadata("design:type", String)
], ProjectDto.prototype, "description", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsEnum)(project_status_enum_1.ProjectStatus),
    tslib_1.__metadata("design:type", String)
], ProjectDto.prototype, "status", void 0);
//# sourceMappingURL=project.dto.js.map