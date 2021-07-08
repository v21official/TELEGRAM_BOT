import { get, post } from './index';

export function addMonitor(body: any) {
    return post(`http://103.57.222.93:8082/api/service/create_update`, body);
}
