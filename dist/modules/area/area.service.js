"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AreaService = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const typeorm_transactional_1 = require("typeorm-transactional");
const utils_1 = require("../../common/utils");
const area_entity_1 = require("./area.entity");
const area_create_dto_1 = require("./dtos/area-create.dto");
let AreaService = class AreaService {
    areaRepository;
    constructor(areaRepository) {
        this.areaRepository = areaRepository;
    }
    async createArea(areaCreateDto) {
        const area = this.areaRepository.create(areaCreateDto);
        await this.areaRepository.save(area);
        return area;
    }
    async getAreas(pageOptionsDto) {
        const queryBuilder = this.areaRepository.createQueryBuilder('area');
        const allowedSortColumns = ['name', 'createdAt'];
        (0, utils_1.applySorting)(queryBuilder, pageOptionsDto, 'area', allowedSortColumns);
        if (pageOptionsDto.q) {
            queryBuilder.andWhere('LOWER(area.name) LIKE :name', {
                name: `%${pageOptionsDto.q.toLowerCase().trim()}%`,
            });
        }
        const [items, pageMetaDto] = await queryBuilder.paginate(pageOptionsDto);
        return items.toPageDto(pageMetaDto);
    }
    async getArea(areaId) {
        const queryBuilder = this.areaRepository.createQueryBuilder('area');
        queryBuilder.where('area.id = :areaId', {
            areaId,
        });
        const areaEntity = await queryBuilder.getOne();
        if (!areaEntity) {
            throw new common_1.NotFoundException('Area not found!');
        }
        return areaEntity.toDto();
    }
    async deleteArea(id) {
        const queryBuilder = this.areaRepository
            .createQueryBuilder('area')
            .where('area.id = :id', { id });
        const areaEntity = await queryBuilder.getOne();
        if (!areaEntity) {
            throw new common_1.NotFoundException('Area not found!');
        }
        await this.areaRepository.remove(areaEntity);
    }
    async updateArea(id, areaDto) {
        const queryBuilder = this.areaRepository
            .createQueryBuilder('area')
            .where('area.id = :id', { id });
        const areaEntity = await queryBuilder.getOne();
        if (!areaEntity) {
            throw new common_1.NotFoundException('Area not found!');
        }
        this.areaRepository.merge(areaEntity, areaDto);
        await this.areaRepository.save(areaEntity);
    }
};
exports.AreaService = AreaService;
tslib_1.__decorate([
    (0, typeorm_transactional_1.Transactional)(),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [area_create_dto_1.AreaCreateDto]),
    tslib_1.__metadata("design:returntype", Promise)
], AreaService.prototype, "createArea", null);
exports.AreaService = AreaService = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__param(0, (0, typeorm_1.InjectRepository)(area_entity_1.AreaEntity)),
    tslib_1.__metadata("design:paramtypes", [typeorm_2.Repository])
], AreaService);
//# sourceMappingURL=area.service.js.map