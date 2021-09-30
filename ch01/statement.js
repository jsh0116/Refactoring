/* 공연료 청구서 출력하는 코드 (refactoring 전) */
const statement = (invoices, plays) => {
    let totalAmount = 0; // 총액
    let volumeCredits = 0; // 적립포인트
    let result = `청구 내역 (고객명: ${invoices.customer})\n`;
    const format = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: 'USD',
        minimumFractionDigits: 2
    }).format;

    for (let performance of invoices.performances) {
        const play = plays[performance.playID]; // { "name": "Hamlet", "type": "tragedy" }
        let thisAmount = 0;

        switch (play.type) {
            case "tragedy": {
                thisAmount = 40000;
                if (performance.audience > 30) {
                    thisAmount += 1000 * (performance.audience - 30);
                }
                break;
            }
            case "comedy": {
                thisAmount = 30000;
                if (performance.audience > 20) {
                    thisAmount += 10000 + 500 * (performance.audience - 20);
                }
                thisAmount += 300 * performance.audience;
                break;
            }
            default:
                throw new Error(`알 수 없는 장르: ${play.type}`);
        }
        // 포인트 적립
        volumeCredits += Math.max(performance.audience - 30, 0);
        // comedy 관객 5명마다 추가 포인트 제공
        if (play.type === 'comedy') {
            volumeCredits += Math.floor(performance.audience / 5);
        }
        //청구 내역 출력
        result += `${play.name}: ${format(thisAmount / 100)} (${performance.audience}석)\n`;
        totalAmount += thisAmount;
    }
    result += `총액: ${format(totalAmount / 100)}\n`;
    result += `적립포인트: ${volumeCredits}점\n`;
    return result;
}

export default statement;