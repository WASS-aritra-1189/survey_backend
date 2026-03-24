/**
 * Copyright (c) 2025 Webapp Software Solutions. All rights reserved.
 * This file belongs to Webapp Software Solutions and is proprietary and confidential.
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Website: https://webappssoft.com
 */

import { ConflictException, Inject, Injectable } from "@nestjs/common";
import type { IPasswordService, IRegisterService } from "../interfaces/auth.interface";
import { InjectRepository } from "@nestjs/typeorm";
import { Account } from "src/modules/account/entities/account.entity";
import { StaffDetail } from "src/modules/staff-details/entities/staff-detail.entity";
import { Designation } from "src/modules/designations/entities/designation.entity";
import { Repository } from "typeorm";
import { RegisterDto } from "../dto/register.dto";

@Injectable()
export class RegisterService implements IRegisterService{
    constructor(
        @InjectRepository(Account) private readonly accRepo:Repository<Account>,
        @InjectRepository(StaffDetail) private readonly staffRepo:Repository<StaffDetail>,
        @InjectRepository(Designation) private readonly designationRepo:Repository<Designation>,
        @Inject('IPasswordService') private readonly passwordService:IPasswordService
    ) {}

    async register(dto:RegisterDto): Promise<Account> {
        const existingAccount = await this.accRepo.findOne({
          where: { loginId: dto.loginId }
        });
        if (existingAccount) {
          throw new ConflictException('Account already exists');
        }
        const hashedPassword = await this.passwordService.hash(dto.password);
        const account = this.accRepo.create({
          loginId: dto.loginId,
          password: hashedPassword,
          accountLevelId: dto.accountLevelId,
          settingId: dto.settingId,
          roles: dto.roleIds
        });
        const savedAccount = await this.accRepo.save(account);
        
        const defaultDesignation = await this.designationRepo.findOne({ where: {} });
        
        const staffDetail = this.staffRepo.create({
          accountId: savedAccount.id,
          firstName: null as unknown as string,
          lastName: null as unknown as string,
          email: null as unknown as string,
          phone: null as unknown as string,
          designationId: defaultDesignation?.id
        } as any);
        await this.staffRepo.save(staffDetail);
        
        return savedAccount;
      }
}