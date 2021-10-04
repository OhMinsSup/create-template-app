declare namespace Kakao {
  /**
   * Kakao JavaScript SDK에서 사용한 리소스를 해제합니다.
   */
  function cleanup(): void;

  /**
   * 카카오 JavaScript SDK를 초기화합니다. SDK를 사용하기 전에 호출해야 합니다.
   * @param appKey JavaScript 키
   * @throw {KakaoError} 앱키가 유효하지 않을 때 에러가 발생합니다.
   */
  function init(appKey: string): void;

  /**
   * 카카오 JavaScript SDK의 초기화 여부를 반환합니다.
   * @returns {boolean} 초기화되었다면 true, 초기화되지 않았다면 false.
   */
  function isInitialized(): boolean;
}

interface KakaoAuthUserAccountProfile {
  nickname: string; // 닉네임;
  thumbnail_image_url: string; // 	프로필 미리보기 이미지 URL 110px * 110px 또는 100px * 100px
  profile_image_url: string; // 프로필 사진 URL 640px * 640px 또는 480px * 480px
  is_default_image: boolean; // 프로필 사진 URL이 기본 프로필 사진 URL인지 여부 사용자가 등록한 프로필 사진이 없을 경우, 기본 프로필 사진 제공 true: 기본 프로필 사진 false: 사용자가 등록한 프로필 사진
}

interface KakaoAuthUserAccount {
  profile_needs_agreement: boolean; // 사용자 동의 시 프로필 정보(닉네임/프로필 사진) 제공 가능 필요한 동의 항목: 프로필 정보(닉네임/프로필 사진)
  profile_nickname_needs_agreement: boolean; // 사용자 동의 시 닉네임 제공 가능 필요한 동의 항목: 닉네임
  profile_image_needs_agreement: boolean; // 사용자 동의 시 프로필 사진 제공 가능 필요한 동의 항목: 프로필 사진
  profile: Partial<KakaoAuthUserAccountProfile>;
  email_needs_agreement: boolean; // 사용자 동의 시 카카오계정 대표 이메일 제공 가능 필요한 동의 항목: 카카오계정(이메일)
  is_email_valid: boolean; // 카카오계정(이메일) 유효성 여부
  is_email_verified: boolean; // 카카오계정(이메일) 인증 여부
  email: string; // 카카오계정(이메일)
  age_range_needs_agreement: boolean; // 사용자 동의 시 연령대 제공 가능 필요한 동의 항목: 연령대
  age_range: string; // 연령대
  birthyear_needs_agreement: boolean; // 사용자 동의 시 생년월일 제공 가능 필요한 동의 항목: 생년월일
  birthyear: string; // 생년월일
  birthday_needs_agreement: boolean; // 사용자 동의 시 생일 제공 가능 필요한 동의 항목: 생일
  birthday: string; // 생일
  birthday_type: string; // 생일 타입
  gender_needs_agreement: boolean; // 사용자 동의 시 성별 제공 가능 필요한 동의 항목: 성별
  gender: string; // 성별 female: 여성 male: 남성 필요한 동의 항목: 성별
  phone_number_needs_agreement: boolean; // 사용자 동의 시 전화번호 제공 가능
  phone_number: string; // 카카오계정의 전화번호
  ci_needs_agreement: boolean; // 사용자 동의 시 CI 참고 가능
  ci: string; // 연계정보
  ci_authenticated_at: number; // CI 발급 시각, UTC*
}

interface KakaoAuthUser {
  id: number; // 회원번호
  has_signed_up?: boolean; // 자동 연결 설정을 비활성화한 경우만 존재 연결하기 호출의 완료 여부 false: 연결 대기(Preregistered) 상태 true: 연결(Registered) 상태
  connected_at?: number; // 서비스에 연결 완료된 시각, UTC*
  synched_at?: number; // 카카오싱크 간편가입을 통해 로그인한 시각, UTC*
  properties: Record<string, any>; // 사용자 프로퍼티(Property)
  kakao_account?: Partial<KakaoAuthUserAccount>;
}

interface KakaoAuthFailCallbackParams {
  error: string; // 고정값 "access_denied"
  error_description: string;
}

interface KakaoAuthStatusCallbackParams {
  status: string; // "connected" 또는 "not_connected"
  user: KakaoAuthUser;
}

interface KakaoAuthSuccessCallbackParams {
  access_token: string; // 사용자 토큰
  refresh_token: string; // 사용자 토큰 재발급 토큰
  token_type: string; // 고정값 "bearer"
  expires_in: number; // 토큰 만료 시간
  scope: string; // 추가 동의 받을 항목의 키 ex) "account_email,
}

type KakaoAuthFailCallback = (error: KakaoAuthFailCallbackParams) => void;

type KakaoAuthStatusCallback = (status: KakaoAuthStatusCallbackParams) => void;

type KakaoAuthSuccessCallback = (auth: KakaoAuthSuccessCallbackParams) => void;

interface KakaoAuthAuthorizeParams {
  redirectUri: string; // 인가 코드를 받을 URI
  state: string; // 인가 코드 요청과 응답 과정에서 유지할 수 있는 파라미터
  scope: string; // 추가 동의 받을 항목의 키
  throwOnError: boolean; // 간편 로그인 사용 여부
  prompts: string; // 인가 코드 요청 시 추가 상호작용을 요청하고자 할 때 전달하는 파라미터
}

interface KakaoAuthCreateLoginButtonParams {
  container: string | HTMLElement; // DOM Element 또는 Element의 ID Selector를 넘기면, 해당 Element 내부에 로그인 버튼이 생성됩니다.
  lang?: string; // 로그인 버튼에 표시할 언어, "kr"|"en"
  size?: string; // 로그인 버튼의 사이즈, "small"|"medium"|"large"
  success?: KakaoAuthSuccessCallback | Function; // 로그인이 성공할 경우 토큰을 받을 콜백 함수
  fail?: KakaoAuthFailCallback | Function; // 로그인이 실패할 경우 에러를 받을 콜백 함수
  always?: KakaoAuthSuccessCallback | KakaoAuthFailCallback | Function; // 로그인 성공 여부에 관계 없이 항상 호출되는 함수
  scope?: string; // 추가 동의 받을 항목의 키 ex) "account_email,gender"
  persistAccessToken?: boolean; // 세션이 종료된 뒤에도 액세스 토큰을 사용할 수 있도록 로컬 스토리지 저장 여부
  throughTalk?: boolean; // 간편 로그인 사용 여부
}

interface KakaoAuthLoginParams {
  success: KakaoAuthSuccessCallback | Function; // 로그인이 성공할 경우 토큰을 받을 콜백 함수
  fail: KakaoAuthFailCallback | Function; // 로그인이 실패할 경우 에러를 받을 콜백 함수
  always: KakaoAuthSuccessCallback | KakaoAuthFailCallback | Function; // 로그인 성공 여부에 관계 없이 항상 호출되는 함수
  scope: string; // 추가 동의 받을 항목의 키 ex) "account_email,gender"
  persistAccessToken: boolean; // 세션이 종료된 뒤에도 액세스 토큰을 사용할 수 있도록 로컬 스토리지 저장 여부
  throughTalk: boolean; // 간편 로그인 사용 여부
}

interface KakaoAuthLoginFormParams {
  success: Function; // 로그인이 성공할 경우 토큰을 받을 콜백 함수
  fail: Function; // 로그인이 실패할 경우 에러를 받을 콜백 함수
  always: Function; // 로그인 성공 여부에 관계 없이 항상 호출되는 함수
  scope: string; // 추가 동의 받을 항목의 키 ex) "account_email,gender"
  persistAccessToken: boolean; // 세션이 종료된 뒤에도 액세스 토큰을 사용할 수 있도록 로컬 스토리지 저장 여부
}

/**
 * 사용자 인증과 관련된 함수들이 포함되어 있습니다.
 */
declare namespace Kakao.Auth {
  /**
   *사용자가 앱에 로그인할 수 있도록 인가 코드를 요청하는 함수입니다. 인가 코드를 받을 수 있는 서버 개발이 필요합니다.
   * @param settings
   */
  function authorize(settings?: Partial<KakaoAuthAuthorizeParams>): void;

  /**
   * 로그인 버튼을 생성하기 위해 삽입한 iframe을 삭제하고 리소스를 해제합니다.
   */
  function cleanup(): void;

  /**
   * 카카오 로그인 버튼을 생성합니다. (Kakao.Auth.login 직접 로그인 버튼을 제작하여 사용할 때 이용하세요.)
   * @param settings
   */
  function createLoginButton(settings: KakaoAuthCreateLoginButtonParams): void;

  /**
   * 사용 중인 액세스 토큰
   */
  function getAccessToken(): string;

  /**
   * 사용중인 App Key
   */
  function getAppKey(): string;

  /**
   * 이 API는 보안 정책으로 인해 폐기되었습니다.
   * @deprecated
   */
  function getRefreshToken(): string;

  /**
   * 현재 로그인 상태를 반환합니다.
   * @param callback
   */
  function getStatusInfo(callback?: KakaoAuthStatusCallback): void;

  /**
   * 사용자가 앱에 로그인할 수 있도록 로그인 팝업창을 띄우는 함수입니다. 사용자의 클릭 이벤트 이후에 호출되어야 브라우저에 의해 팝업이 차단되지 않습니다.
   * Kakao.Auth.createLoginButton 직접 로그인 버튼을 제작하여 사용할 필요가 없는 경우 유용합니다.
   * @param settings
   */
  function login(settings?: Partial<KakaoAuthLoginParams>): void;

  /**
   * 다른 계정으로 로그인할 수 있도록 로그인 팝업창을 띄우는 함수입니다. 사용자의 클릭 이벤트 이후에 호출되어야 브라우저에 의해 팝업이 차단되지 않습니다.
   * @param settings
   */
  function loginForm(settings: KakaoAuthLoginFormParams): void;

  /**
   * 현재 로그인되어 있는 사용자를 로그아웃시키고, Access Token을 삭제합니다.
   * @param callback
   */
  function logout(callback?: Function): void;

  /**
   * API 호출 시 사용할 액세스 토큰을 설정합니다.
   * @param token
   * @param persist
   */
  function setAccessToken(token: string, persist?: boolean): void;

  /**
   * 이 API는 보안 정책으로 인해 폐기되었습니다.
   * @deprecated
   * @param token
   * @param persist
   */
  function setRefreshToken(token: string, persist?: boolean): void;
}

interface KakaoAPIRequestParams<D = any> {
  url: string; // 호출할 API URL => 호스트가 https://dapi.kakao.com인 API (검색, 로컬, 비전, 번역)는 제외되며, Ajax를 통해 직접 요청할 수 있습니다. Admin 키를 사용하는 API (인증, 푸시, 페이)는 제외됩니다. 푸시 알림 기능은 지원되지 않습니다.
  data?: Record<string, D>; // API에 전달할 파라미터
  files?: FileList | Array<File> | Array<Blob>; // 파일 첨부가 필요한 API에서 이용하는 파일 파라미터
  success?: Function | ((result: any) => void); // API 호출이 성공할 경우 결과를 받을 콜백 함수
  fail?: Function | ((error: any) => void); // API 호출이 실패할 경우 결과를 받을 콜백 함수
  always?: Function | ((result: any) => void) | ((error: any) => void); // API 호출이 실패할 경우 결과를 받을 콜백 함수
}

// 카카오 API와 관련된 함수들이 포함되어 있습니다.
declare namespace Kakao.API {
  /**
   * API를 호출하기 위해 사용한 리소스를 해제합니다.
   */
  function cleanup(): void;

  function request<P = any>(settings: KakaoAPIRequestParams): Promise<P>;
}
