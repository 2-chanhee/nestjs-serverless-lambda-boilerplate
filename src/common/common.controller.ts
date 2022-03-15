import { Controller, Get } from '@nestjs/common';
import { ApiHeader, ApiOkResponse } from '@nestjs/swagger';

import { CommonService } from './common.service';

@Controller('/common')
export class CommonController {
    constructor(private readonly commonService: CommonService) {}

    @Get('/status')
    @ApiHeader({ name: 'Authorization', required: false })
    @ApiOkResponse({ type: 'string' })
    getServerStatus() {
        return this.commonService.getServerStatus();
    }
}
