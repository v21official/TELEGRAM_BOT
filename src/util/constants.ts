export class CONSTANTS {
    static readonly AVATAR_DEFAULT = 'https://sso.inet.vn/public/img/avatar/default.jpeg';
    static readonly SECRET_KEY = 'CHAT_BOT_2021';
    static readonly FIRST_PAGE = 1;
    static readonly ERROR = {
        USERNAME_EXISTS: 'Username exists',
        PERMISSION_DENIED: 'Permission Denied',
        ACCOUNT_CANNOT_CONNECT: 'Can not connect to given account',
        INVALID_PARAMETER: 'Invalid parameter',
        DATA_NOT_FOUND: 'Data Not Found',
        WRONG_PASSWORD: 'Wrong Password',
    };
    static readonly TEXT = {
        DO_YOU_LOVE_ME: 'Do you love me?',
    };
    static readonly STATUS = {
        SUCCESS: 'SUCCESS',
        ERROR: 'ERROR',
    };
    static readonly COMMAND = {
        WHOIS: 'whois',
        MONITOR_ADD: 'monitor_add',
        CANCEL: 'cancel',
    };
    static readonly BOT_INTRO = `Xin chào, tôi là trợ lý của v21official
    
/tha_tim - Bot thả tim
/monitor_add - Thêm mới dịch vụ
/whois - Kiểm tra tên miền
/cancel - Hủy lệnh đang chờ và xóa keyboard
    `;
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
