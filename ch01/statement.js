/* 공연료 청구서 출력하는 코드 (refactoring 전) */

/* Refactoring 내용
 * 1. 함수 추출 : amountFor()
 * 2. 변수 naming: result, aPerformance
 * 3. play 변수 제거 : 임시 변수를 질의 함수로 바꾸기 : (play를 playFor() 호출로 변경)
 * 4. format 변수 제거 및 함수 이름 변경
 * 5. volumeCredits, totalAmount 변수 제거 : 반복문 쪼개기, 문장 슬라이드하기, 임시 변수를 질의 함수로 바꾸기
*/

const renderPlainText = (data, invoices, plays) => {

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

    const volumeCreditsFor = (aPerformance) => {
        let result = 0;
        result += Math.max(aPerformance.audience - 30, 0);
        if (playFor(aPerformance).type === 'comedy') {
            result += Math.floor(aPerformance.audience / 5);
        }
        return result;
    }

    const usd = (aNumber) => new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: 'USD',
        minimumFractionDigits: 2
    }).format(aNumber/100);

    const totalVolumeCredits = () => {
        let result = 0;
        for(let performance of invoices.performances) {
            result += volumeCreditsFor(performance);
        }
        return result;
    }

    const totalAmount = () => {
        let result = 0;
        for (let performance of invoices.performances) {
            result += amountFor(performance);
        }
        return result;
    }

    let result = `청구 내역 (고객명: ${invoices.customer})\n`;

    for (let performance of invoices.performances) {
        //청구 내역 출력
        result += `${playFor(performance).name}: ${usd(amountFor(performance))} (${performance.audience}석)\n`;    
    }

    result += `총액: ${usd(totalAmount())}\n`;
    result += `적립포인트: ${totalVolumeCredits()}점\n`;
    return result;
};

const statement = (invoices, plays) => {
    const statementData = {};
    return renderPlainText(statementData, invoices, plays);
}

export default statement;