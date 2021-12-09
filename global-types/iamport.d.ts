declare namespace IMP {
  export type PG_CODE = {
    html5_inicis: 'html5_inicis'; // (이니시스웹표준)
    inicis: 'inicis'; // (이니시스ActiveX결제창)
    kcp: 'kcp'; // (NHN KCP)
    kcp_billing: 'kcp_billing'; // (NHN KCP 정기결제)
    uplus: 'uplus'; // (토스페이먼츠(구 LG U+))
    nice: 'nice'; // (나이스페이)
    jtnet: 'jtnet'; // (JTNet)
    kicc: 'kicc'; //(한국정보통신)
    bluewalnut: 'bluewalnut'; // (블루월넛)
    kakaopay: 'kakaopay'; // (카카오페이)
    danal: 'danal'; //(다날휴대폰소액결제)
    danal_tpay: 'danal_tpay'; //(다날일반결제)
    mobilians: 'mobilians'; // (모빌리언스 휴대폰소액결제)
    chai: 'chai'; // (차이 간편결제)
    syrup: 'syrup'; //(시럽페이)
    payco: 'payco'; // (페이코)
    paypal: 'paypal'; //(페이팔)
    eximbay: 'eximbay'; // (엑심베이)
    naverpay: 'naverpay'; // (네이버페이-결제형)
    naverco: 'naverco'; //(네이버페이-주문형)
    smilepay: 'smilepay'; //(스마일페이)
    alipay: 'alipay'; // (알리페이)
  };

  export type PAY_METHOD = {
    card: 'card'; // (신용카드)
    trans: 'trans'; // (실시간계좌이체)
    vbank: 'vbank'; // (가상계좌)
    phone: 'phone'; //(휴대폰소액결제)
    samsung: 'samsung'; // (삼성페이 / 이니시스, KCP 전용)
    kpay: 'kpay'; // (KPay앱 직접호출 / 이니시스 전용)
    kakaopay: 'kakaopay'; // (카카오페이 직접호출 / 이니시스, KCP, 나이스페이먼츠 전용)
    payco: 'payco'; // (페이코 직접호출 / 이니시스, KCP 전용)
    lpay: 'lpay'; // (LPAY 직접호출 / 이니시스 전용)
    ssgpay: 'ssgpay'; // (SSG페이 직접호출 / 이니시스 전용)
    tosspay: 'tosspay'; // (토스간편결제 직접호출 / 이니시스 전용)
    cultureland: 'cultureland'; // (문화상품권 / 이니시스, 토스페이먼츠(구 LG U+), KCP 전용)
    smartculture: 'smartculture'; // (스마트문상 / 이니시스, 토스페이먼츠(구 LG U+), KCP 전용)
    happymoney: 'happymoney'; // (해피머니 / 이니시스, KCP 전용)
    booknlife: 'booknlife'; // (도서문화상품권 / 토스페이먼츠(구 LG U+), KCP 전용)
    point: 'point'; // (베네피아 포인트 등 포인트 결제 / KCP 전용)
  };

  export type CURRENCY = {
    KRW: 'KRW'; // (원화)
    USD: 'USD'; // (달러)
    EUR: 'EUR'; // (유로)
    JPY: 'JPY'; // (엔화)
  };

  export type STATUS = {
    ready: 'ready'; // (브라우저 창 이탈, 가상계좌 발급 완료 등 미결제 상태)
    paid: 'paid'; //(결제완료)
    failed: 'failed'; // (신용카드 한도 초과, 체크카드 잔액 부족, 브라우저 창 종료 또는 취소 버튼 클릭 등 결제실패 상태)
  };

  interface RequestPayAdditionalParams {
    /**
     * @default false
     * @description 결제상품이 컨텐츠인지 여부(휴대폰 소액결제시 필수)
     * 반드시 실물/컨텐츠를 정확히 구분해주어야 함
     */
    digital?: boolean;
    /**
     * @description 가상계좌 입금기한(YYYYMMDDhhmm)
     */
    vbank_due?: string;
    /**
     * @description 리디렉션 방식으로 호출된 결제창에서 결제 후에 이동 될 주소
     */
    m_redirect_url?: string;
    /**
     * @description 모바일 앱 결제중 앱복귀를 위한 URL scheme(WebView 결제시 필수)
     * ISP/앱카드 앱에서 결제정보인증 후 기존 앱으로 복귀할 때 사용됨
     */
    app_scheme?: string;
    /**
     * @description 계약된 사업자등록번호 10자리(기호 미포함) 다날-가상계좌 결제시 필수 항목
     */
    biz_num?: string;
  }

  interface Display {
    /**
     * @description 50,000원 이상 금액 결제 시, 할부개월 수 선택 요소 제어 옵션
     * @description 미입력: PG사의 기본 할부개월 수 목록 제공
     * @description []: 일시불만 결제 가능
     * @description 2,3,4,5,6: 일시불을 포함한 2, 3, 4, 5, 6개월까지 할부개월 선택 가능(KG이니시스, KCP만 지원
     */
    card_quota?: number[];
  }

  interface RequestPayParams extends RequestPayAdditionalParams {
    /**
     * @description 값 형식: [PG사 코드값] 또는 [PG사 코드값].[PG사 상점아이디]
     */
    pg?: keyof PG_CODE;
    /**
     * @description 결제수단
     */
    pay_method?: keyof PAY_METHOD;
    /**
     * @description 에스크로가 적용되는 결제창을 호출할지 여부
     */
    escrow?: boolean;
    /**
     * @description 가맹점에서 생성/관리하는 고유 주문번호
     * 이미 결제가 승인 된(status: paid) merchant_uid로는 재결제 불가
     */
    merchant_uid: string;
    /**
     * @description 주문명
     */
    name?: string;
    /**
     * @description 결제할 금액
     */
    amount: number;
    /**
     * @description 가맹점 임의 지정 데이터
     * 주문건에 대해 부가정보를 저장할 공간이 필요할 때 사용
     */
    custom_data?: Record<string, string | number>;
    /**
     * @description amount 중 면세공급가액에 해당하는 금액
     */
    tax_free?: number; // amount 중 면세공급가액에 해당하는 금액
    /**
     * @deprecated
     * @description amount 중 부가세 금액, 복합과세 적용시 더 정확한 계산을 위해 tax_free 파라미터 사용을 권장
     */
    vat?: number;
    /**
     * @default KRW
     * @description 통화 설정 (PayPal은 원화(KRW) 미지원으로 USD가 기본값)
     */
    currency?: keyof CURRENCY;
    /**
     * @default ko
     * @description 결제창에 표시될 언어 설정
     * @description KG이니시스, 토스페이먼츠(구 LG U+), 나이스페이먼츠 : en 또는 ko(KG이니시스, 나이스페이먼츠는 PC 결제창만 지원됨)
     * @description PayPal: 2자리 region code(PayPal 로케일 코드 참조)
     */
    language?: string;
    /**
     * @description 주문자 이메일
     */
    buyer_email?: string;
    /**
     * @description 주문자명
     */
    buyer_name?: string;
    /**
     * @description 주문자 연락처(누락되거나 공백일때 일부 PG사에서 오류 발생)
     */
    buyer_tel: string;
    /**
     * @description 주문자 주소
     */
    buyer_addr?: string;
    /**
     * @description 주문자 우편번호
     */
    buyer_postcode?: string;
    /**
     * @description 관리자 콘솔에서 설정하는 Notification URL대신 사용할 URL
     * 주문마다 다른 혹은 복수의 Notification URL이 필요한 경우 사용
     */
    notice_url?: string | string[];
    /**
     * @description 결제화면 구성 설정
     */
    display?: Display;
  }

  interface RequestPayAdditionalResponse {
    /**
     * @description 카드사 승인번호(신용카드결제에 한하여 제공)
     */
    apply_num?: string;
    /**
     * @description 가상계좌 입금계좌번호
     */
    vbank_num?: string;
    /**
     * @description 가상계좌 은행명
     */
    vbank_name?: string;
    /**
     * @description 가상계좌 예금주 계약된 사업자명으로 표시됨, 단, 일부 PG사의 경우 null을 반환하므로 자체 처리 필요
     */
    vbank_holder?: string | null;
    /**
     * @description 가상계좌 입금기한(UNIX timestamp)
     */
    vbank_date?: number;
  }

  interface RequestPayResponse extends RequestPayAdditionalResponse {
    /**
     * @description 결제의 성공여부 (PG사/결제수단에 따라 imp_success로 반환됨)
     */
    success: boolean;
    /**
     * @description 결제가 실패한 경우 단축 메세지(현재 코드체계는 없음)
     */
    error_code?: string;
    /**
     * @description 결제가 실패한 경우 상세 메세지
     */
    error_msg?: string;
    /**
     * @description 아임포트 고유 결제번호
     * success가 false이고 사전 validation에 실패한 경우, imp_uid는 null일 수 있음
     */
    imp_uid: string | null;
    /**
     * @description 가맹점에서 생성/관리하는 고유 주문번호
     */
    merchant_uid: string;
    /**
     * @description 결제수단
     */
    pay_method?: keyof PAY_METHOD;
    /**
     * @description 결제금액 결제승인된 또는 가상계좌 입금예정 금액
     */
    paid_amount?: number;
    /**
     * @description 결제상태
     */
    status?: keyof STATUS;
    /**
     * @description 주문명
     */
    name?: string;
    /**
     * @description 결제승인/시도된 PG사
     */
    pg_provider?: keyof Pick<
      PG_CODE,
      | 'html5_inicis'
      | 'inicis'
      | 'kakaopay'
      | 'uplus'
      | 'nice'
      | 'jtnet'
      | 'danal'
    >;
    /**
     * @description 결제창에서 간편결제 호출시 결제 승인된 PG사
     * @description KG이니시스, NHN KCP, 토스페이먼츠에서 pay_method = card 일때, 결제창에서 선택한 간편결제 PG사( Naver Pay, Kako Pay, Payco, Samsung Pay, SSG Pay, L.pay, Kpay )
     */
    emb_pg_provider?:
      | keyof Pick<PG_CODE, 'naverpay'>
      | keyof Pick<
          PAY_METHOD,
          'samsung' | 'lpay' | 'ssgpay' | 'kpay' | 'kakaopay' | 'payco'
        >;
    /**
     * @description PG사 거래고유번호
     */
    pg_tid?: string;
    /**
     * @description 주문자 이름
     */
    buyer_name?: string;
    /**
     * @description 주문자 Email
     */
    buyer_email?: string;
    /**
     * @description 주문자 연락처
     */
    buyer_tel?: string;
    /**
     * @description 주문자 주소
     */
    buyer_addr?: string;
    /**
     * @description 주문자 우편번호
     */
    buyer_postcode?: string;
    /**
     * @description 가맹점 임의 지정 데이터
     */
    custom_data?: Record<string, string | number>;
    /**
     * @description 결제승인시각(UNIX timestamp)
     */
    paid_at?: number;
    /**
     * @description PG사에서 발행되는 거래 매출전표 URL, 전달되는 URL을 클릭하면 매출전표 확인가능
     */
    receipt_url?: string;
  }

  type RequestCertificationParams = {
    /**
     * @version (v1.1.4부터 지원)
     * @description 가맹점에서 생성/관리하는 고유 주문번호
     */
    merchant_uid?: string;
    /**
     * @version (v1.1.4부터 지원)
     * @description 허용하는 최소 만 나이 (생일기준)
     */
    min_age?: number;
    /**
     * @version (v1.1.4부터 지원)
     * @description 고객 이름
     */
    name?: string;
    /**
     * @version (v1.1.4부터 지원)
     * @description 고객 전화번호 (-, . 등 구분자 포함가능)
     */
    phone?: string;
    /**
     * @version (v1.1.4부터 지원)
     * @description 본인인증 통신사
     */
    carrier?: string;
    /**
     * @deprecated
     * @description 본인인증 대상 생년월일 지정 다날 정책에 의해 더이상 해당 파라미터는 지원하지 않습니다
     */
    birth?: string;
    /**
     * @version (v1.1.4부터 지원)
     * @description 서비스 도메인 URL 또는 명칭
     */
    company?: string;
    /**
     * @version v1.1.7
     * @description 모바일에만 적용
     */
    m_redirect_url?: string;
    /**
     * @version v1.1.7
     * @default false
     * @description 모바일에만 적용
     */
    popup?: boolean;
  };

  /**
   * 주문 페이지에 가맹점 식별코드를 이용하여 IMP 객체를 초기화합니다.
   * @param accountID 가맹점 식별코드
   */
  function init(accountID: string): void;

  /**
   * 필요한 결제 정보로 IMP.request_pay를 호출하여 결제 요청을 하면 PG사의 결제 페이지가 열립니다.
   * @param params
   * @param callback iframe 방식으로 호출된 결제창에서 결제 후 호출되는 함수.
   */
  function request_pay(
    params: RequestPayParams,
    callback?: (rsp: RequestPayResponse) => void,
  ): void;

  /**
   * PG사의 휴대폰 또는 신용카드 본인인증 창을 호출한다.
   * @param params
   * @param callback iframe 방식으로 호출된 결제창에서 결제 후 호출되는 함수.
   */
  function certification(
    params?: RequestCertificationParams,
    callback?: (
      rsp: Required<
        Pick<
          RequestPayResponse,
          'success' | 'error_code' | 'error_msg' | 'imp_uid' | 'merchant_uid'
        >
      >,
    ) => void,
  ): void;
}
