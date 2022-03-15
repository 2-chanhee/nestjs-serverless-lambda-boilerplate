import { Injectable } from '@nestjs/common';

@Injectable()
export class CommonService {
    getServerStatus() {
        return 'healthy';
    }
}
