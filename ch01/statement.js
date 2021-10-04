/* 공연료 청구서 출력하는 코드 (refactoring 전) */

/* Refactoring 내용
 * 1. 함수 추출 : amountFor()
 * 2. 변수 naming: result, aPerformance
 * 3. play 변수 제거 : 임시 변수를 질의 함수로 바꾸기 : (play를 playFor() 호출로 변경)
*/

const statement = (invoices, plays) => {

    const playFor = aPerformance => plays[aPerformance.playID];

    // amountFor()를 statement()의 중첩 함수로 만든다
    const amountFor = (aPerformance) => {
        let result = 0;
        switch (playFor(aPerformance).type) {
            case "tragedy": {
                result = 40000;
                if (aPerformance.audience > 30) {
                    result += 1000 * (aPerformance.audience - 30);
                }
                break;
            }
            case "comedy": {
                result = 30000;
                if (aPerformance.audience > 20) {
                    result += 10000 + 500 * (aPerformance.audience - 20);
                }
                result += 300 * aPerformance.audience;
                break;
            }
            default:
                throw new Error(`알 수 없는 장르: ${playFor(aPerformance).type}`);
        }
        return result;
    }

    let totalAmount = 0; // 총액
    let volumeCredits = 0; // 적립포인트
    let result = `청구 내역 (고객명: ${invoices.customer})\n`;
    const format = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: 'USD',
        minimumFractionDigits: 2
    }).format;

    for (let performance of invoices.performances) {
        // 포인트 적립
        volumeCredits += Math.max(performance.audience - 30, 0);

        // comedy 관객 5명마다 추가 포인트 제공
        if (playFor(performance).type === 'comedy') {
            volumeCredits += Math.floor(performance.audience / 5);
        }

        //청구 내역 출력
        result += `${playFor(performance).name}: ${format(amountFor(performance) / 100)} (${performance.audience}석)\n`;
        totalAmount += amountFor(performance);
    }
    result += `총액: ${format(totalAmount / 100)}\n`;
    result += `적립포인트: ${volumeCredits}점\n`;
    return result;
}

export default statement;