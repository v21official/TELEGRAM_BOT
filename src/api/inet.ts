import { get, post } from './index';

export function whoisDomain(domain: string) {
    return get(`https://whois.inet.vn/api/whois/domainspecify/${domain}`);
}
