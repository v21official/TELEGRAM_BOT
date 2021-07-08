export class CONSTANTS {
    static readonly STATUS = {
        SUCCESS: 'SUCCESS',
        ERROR: 'ERROR',
    };
    static readonly COMMAND = {
        WHOIS: 'whois',
        MONITOR_ADD: 'monitor_add',
        CANCEL: 'cancel',
    };
    static readonly BOT_INTRO = `Xin chào, tôi là trợ lý của v21official,
    
/monitor_add - Thêm mới dịch vụ
/whois - Kiểm tra thông tin tên miền
/cancel - Hủy lệnh đang chờ và xóa keyboard
    `;
    static readonly TEXT = {
        SUCCESS: 'Thành công',
        ERROR: 'Thất bại',
        PROCESSING: 'Đang xử lý . . .',
        INVALID_DOMAIN: 'Sai định dạng tên miền',
    };
}

export function validateDomain(domain: string) {
    const pattern = new RegExp(
        '^(https?:\\/\\/)?' + // protocol
            '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
            '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
            '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
            '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
            '(\\#[-a-z\\d_]*)?$',
        'i',
    ); // fragment locator
    if (!pattern.test(domain)) return false;
    return true;
}

export function getFullName(senderMessage: any) {
    return (
        (senderMessage.first_name ? senderMessage.first_name : '') +
        ' ' +
        (senderMessage.last_name ? senderMessage.last_name : '')
    ).trim();
}
