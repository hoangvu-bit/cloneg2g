import React, { useState } from 'react';

export default function Modals({
  activeModal,
  setActiveModal,
  loginEmail,
  setLoginEmail,
  loginPassword,
  setLoginPassword,
  signupUsername,
  setSignupUsername,
  signupEmail,
  setSignupEmail,
  signupPassword,
  setSignupPassword,
  sellerGame,
  setSellerGame,
  sellerExperience,
  setSellerExperience,
  handleLoginSubmit,
  handleSignupSubmit,
  handleSellerSubmit,
  triggerToast,
}) {
  const [paymentSearch, setPaymentSearch] = useState('');

  // Local state for UI functionality
  const [showPassword, setShowPassword] = useState(false);
  const [showSignupPassword, setShowSignupPassword] = useState(false);

  // Validation errors
  const [loginEmailError, setLoginEmailError] = useState('');
  const [loginPasswordError, setLoginPasswordError] = useState('');
  const [signupUsernameError, setSignupUsernameError] = useState('');
  const [signupEmailError, setSignupEmailError] = useState('');
  const [signupPasswordError, setSignupPasswordError] = useState('');

  // G2G Signup Specific States
  const [signupTab, setSignupTab] = useState('regular'); // 'regular' | 'business'
  const [signupStep, setSignupStep] = useState(1);       // 1 | 2 (Step 2 is for OTP & password setup)
  const [signupMethod, setSignupMethod] = useState('phone'); // 'phone' | 'email'
  const [countryCode, setCountryCode] = useState('+84');
  const [phoneNum, setPhoneNum] = useState('');
  const [phoneNumError, setPhoneNumError] = useState('');
  const [signupEmailLoc, setSignupEmailLoc] = useState('');
  const [signupEmailLocError, setSignupEmailLocError] = useState('');
  const [signupContact, setSignupContact] = useState('');
  const [signupContactError, setSignupContactError] = useState('');
  const [captchaState, setCaptchaState] = useState('unchecked'); // 'unchecked' | 'checking' | 'verified'
  const [captchaError, setCaptchaError] = useState('');
  const [termsChecked, setTermsChecked] = useState(false);
  const [termsCheckedError, setTermsCheckedError] = useState('');

  // Step 2 Regular OTP Verification States
  const [otpVal, setOtpVal] = useState('');
  const [otpValError, setOtpValError] = useState('');
  const [mockSentOtp, setMockSentOtp] = useState('');
  const [signupNameLoc, setSignupNameLoc] = useState('');
  const [signupNameLocError, setSignupNameLocError] = useState('');
  const [signupPasswordLoc, setSignupPasswordLoc] = useState('');
  const [signupPasswordLocError, setSignupPasswordLocError] = useState('');
  const [showSignupPasswordLoc, setShowSignupPasswordLoc] = useState(false);

  // Business Tab States
  const [bizName, setBizName] = useState('');
  const [bizNameError, setBizNameError] = useState('');
  const [bizTaxId, setBizTaxId] = useState('');
  const [bizTaxIdError, setBizTaxIdError] = useState('');
  const [bizEmail, setBizEmail] = useState('');
  const [bizEmailError, setBizEmailError] = useState('');
  const [bizPhone, setBizPhone] = useState('');
  const [bizPhoneError, setBizPhoneError] = useState('');
  const [bizPassword, setBizPassword] = useState('');
  const [bizPasswordError, setBizPasswordError] = useState('');
  const [bizTermsChecked, setBizTermsChecked] = useState(false);
  const [bizTermsCheckedError, setBizTermsCheckedError] = useState('');
  const [showBizPassword, setShowBizPassword] = useState(false);


  // Submit Wrappers to trigger UI validations
  const onLocalLoginSubmit = (e) => {
    e.preventDefault();
    let hasError = false;

    if (!loginEmail.trim()) {
      setLoginEmailError('Trường này là bắt buộc');
      hasError = true;
    } else {
      setLoginEmailError('');
    }

    if (!loginPassword) {
      setLoginPasswordError('Trường này là bắt buộc');
      hasError = true;
    } else {
      setLoginPasswordError('');
    }

    if (!hasError) {
      handleLoginSubmit(e);
    }
  };

  // Reset fields on modal open/close or tab switch
  React.useEffect(() => {
    setSignupStep(1);
    setPhoneNum('');
    setPhoneNumError('');
    setSignupMethod('phone');
    setSignupEmailLoc('');
    setSignupEmailLocError('');
    setSignupContact('');
    setSignupContactError('');
    setCaptchaState('unchecked');
    setCaptchaError('');
    setTermsChecked(false);
    setTermsCheckedError('');
    setOtpVal('');
    setOtpValError('');
    setMockSentOtp('');
    setSignupNameLoc('');
    setSignupNameLocError('');
    setSignupPasswordLoc('');
    setSignupPasswordLocError('');

    setBizName('');
    setBizNameError('');
    setBizTaxId('');
    setBizTaxIdError('');
    setBizEmail('');
    setBizEmailError('');
    setBizPhone('');
    setBizPhoneError('');
    setBizPassword('');
    setBizPasswordError('');
    setBizTermsChecked(false);
    setBizTermsCheckedError('');
  }, [activeModal, signupTab]);

  if (!activeModal) return null;

  const handleCaptchaClick = () => {
    if (captchaState !== 'unchecked') return;
    setCaptchaState('checking');
    setCaptchaError('');
    setTimeout(() => {
      setCaptchaState('verified');
    }, 1200);
  };

  const handleSendOtp = () => {
    const randomOtp = Math.floor(100000 + Math.random() * 900000).toString();
    setMockSentOtp(randomOtp);
    if (triggerToast) {
      const destination = signupMethod === 'phone' ? `${countryCode} ${phoneNum}` : signupEmailLoc;
      triggerToast(`[G2G Marketplace] Mã OTP xác minh gửi tới bạn là: ${randomOtp} (Hoặc nhập bất kỳ số nào để tiếp tục)`);
    }
  };

  const onRegularSignupStep1Submit = (e) => {
    e.preventDefault();
    let hasError = false;

    const contactVal = signupContact.trim();
    if (!contactVal) {
      setSignupContactError('Trường này là bắt buộc');
      hasError = true;
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const phoneRegex = /^\+?\d{8,15}$/;
      
      const isEmail = emailRegex.test(contactVal);
      const isPhone = phoneRegex.test(contactVal.replace(/[\s-]/g, ""));

      if (isEmail) {
        setSignupMethod('email');
        setSignupEmailLoc(contactVal);
        setSignupContactError('');
      } else if (isPhone) {
        setSignupMethod('phone');
        setPhoneNum(contactVal.replace(/[\s-]/g, ""));
        setSignupContactError('');
      } else {
        setSignupContactError('Vui lòng nhập địa chỉ Email hoặc Số điện thoại hợp lệ (Ví dụ: user@gmail.com hoặc 0912345678)');
        hasError = true;
      }
    }

    if (captchaState !== 'verified') {
      setCaptchaError('Vui lòng hoàn thành xác minh Captcha');
      hasError = true;
    } else {
      setCaptchaError('');
    }

    if (!termsChecked) {
      setTermsCheckedError('Bạn phải đồng ý với Điều khoản hoạt động');
      hasError = true;
    } else {
      setTermsCheckedError('');
    }

    if (!hasError) {
      setSignupStep(2);
      setTimeout(() => {
        handleSendOtp();
      }, 800);
    }
  };

  const onRegularSignupStep2Submit = (e) => {
    e.preventDefault();
    let hasError = false;

    if (!otpVal.trim()) {
      setOtpValError('Vui lòng nhập mã OTP');
      hasError = true;
    } else {
      // Temporarily skip exact OTP checking: any input is accepted!
      setOtpValError('');
    }

    if (!signupNameLoc.trim()) {
      setSignupNameLocError('Trường này là bắt buộc');
      hasError = true;
    } else {
      setSignupNameLocError('');
    }

    if (!signupPasswordLoc) {
      setSignupPasswordLocError('Trường này là bắt buộc');
      hasError = true;
    } else if (
      signupPasswordLoc.length < 8 ||
      !/[A-Z]/.test(signupPasswordLoc) ||
      !/\d/.test(signupPasswordLoc) ||
      !/[^A-Za-z0-9]/.test(signupPasswordLoc)
    ) {
      setSignupPasswordLocError('Mật khẩu phải có ít nhất 8 ký tự, gồm chữ hoa, số và ký tự đặc biệt');
      hasError = true;
    } else {
      setSignupPasswordLocError('');
    }

    if (!hasError) {
      const emailOrPhone = signupMethod === 'phone' ? (countryCode + phoneNum) : signupEmailLoc;
      handleSignupSubmit(e, {
        name: signupNameLoc.trim(),
        mail: emailOrPhone,
        password: signupPasswordLoc,
        role: 'regular'
      });
    }
  };

  const onBusinessSignupSubmit = (e) => {
    e.preventDefault();
    let hasError = false;

    if (!bizName.trim()) {
      setBizNameError('Vui lòng nhập tên công ty/doanh nghiệp');
      hasError = true;
    } else {
      setBizNameError('');
    }

    if (!bizTaxId.trim()) {
      setBizTaxIdError('Vui lòng nhập mã số thuế / số ĐKKD');
      hasError = true;
    } else {
      setBizTaxIdError('');
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!bizEmail.trim()) {
      setBizEmailError('Vui lòng nhập email doanh nghiệp');
      hasError = true;
    } else if (!emailRegex.test(bizEmail.trim())) {
      setBizEmailError('Email không đúng định dạng');
      hasError = true;
    } else {
      setBizEmailError('');
    }

    const bizPhoneRaw = bizPhone.replace(/[\s-]/g, "").trim();
    if (!bizPhoneRaw) {
      setBizPhoneError('Vui lòng nhập số điện thoại');
      hasError = true;
    } else if (!/^\d{8,12}$/.test(bizPhoneRaw)) {
      setBizPhoneError('Số điện thoại không hợp lệ');
      hasError = true;
    } else {
      setBizPhoneError('');
    }

    if (!bizPassword) {
      setBizPasswordError('Trường này là bắt buộc');
      hasError = true;
    } else if (
      bizPassword.length < 8 ||
      !/[A-Z]/.test(bizPassword) ||
      !/\d/.test(bizPassword) ||
      !/[^A-Za-z0-9]/.test(bizPassword)
    ) {
      setBizPasswordError('Mật khẩu phải có ít nhất 8 ký tự, gồm chữ hoa, số và ký tự đặc biệt');
      hasError = true;
    } else {
      setBizPasswordError('');
    }

    if (captchaState !== 'verified') {
      setCaptchaError('Vui lòng hoàn thành xác minh Captcha');
      hasError = true;
    } else {
      setCaptchaError('');
    }

    if (!bizTermsChecked) {
      setBizTermsCheckedError('Bạn phải đồng ý với Điều khoản hoạt động');
      hasError = true;
    } else {
      setBizTermsCheckedError('');
    }

    if (!hasError) {
      handleSignupSubmit(e, {
        name: bizName.trim(),
        mail: bizEmail.trim(),
        password: bizPassword,
        role: 'business',
        company_name: bizName.trim(),
        tax_id: bizTaxId.trim()
      });
    }
  };

  const handleSocialClick = (platform) => {
    if (triggerToast) {
      triggerToast(`Đăng nhập bằng ${platform} hiện đang được phát triển!`);
    }
  };

  return (
    <>
      <style>{`
        .g2g-login-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          z-index: 99999;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          font-family: 'Outfit', 'Inter', -apple-system, sans-serif;
          background: linear-gradient(to bottom, #ff3333 0%, #ff3333 40%, #121315 40%, #121315 100%);
          animation: g2gFadeIn 0.2s ease-out;
        }

        .g2g-signup-tabs {
          display: flex;
          background-color: #17181c;
          border-radius: 8px 8px 0 0;
          margin-bottom: 24px;
          border-bottom: 1px solid #2d2f34;
          overflow: hidden;
        }

        .g2g-signup-tab {
          flex: 1;
          padding: 14px 10px;
          text-align: center;
          color: #9ea2a9;
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s;
          background-color: #17181c;
          border: none;
          outline: none;
        }

        .g2g-signup-tab:hover {
          color: #ffffff;
        }

        .g2g-signup-tab.active {
          color: #ffffff;
          background-color: #1f2125;
          border-bottom: 2px solid #ff3333;
        }

        .g2g-phone-input-group {
          display: flex;
          background-color: #131416;
          border: 1px solid #2d2f34;
          border-radius: 6px;
          overflow: hidden;
          transition: border-color 0.2s;
        }

        .g2g-phone-input-group:focus-within {
          border-color: #ff3333;
        }

        .g2g-phone-input-group.error {
          border-color: #ff3b30;
        }

        .g2g-country-select {
          background-color: #1c1d21;
          border: none;
          border-right: 1px solid #2d2f34;
          color: #ffffff;
          padding: 12px 8px 12px 12px;
          font-size: 14px;
          cursor: pointer;
          outline: none;
        }

        .g2g-phone-raw-input {
          flex: 1;
          background-color: transparent;
          border: none;
          color: #ffffff;
          padding: 12px 16px;
          font-size: 14px;
          outline: none;
        }

        .g2g-captcha-box {
          background-color: #18191c;
          border: 1px solid #2d2f34;
          border-radius: 4px;
          padding: 12px 16px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 20px;
          user-select: none;
          cursor: pointer;
        }

        .g2g-captcha-left {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .g2g-captcha-checkbox {
          width: 24px;
          height: 24px;
          border: 2px solid #5d6168;
          border-radius: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
          background-color: #131416;
        }

        .g2g-captcha-checkbox.verified {
          border-color: #34c759;
          background-color: #34c759;
        }

        .g2g-captcha-spinner {
          width: 14px;
          height: 14px;
          border: 2px solid #5d6168;
          border-top-color: #ffffff;
          border-radius: 50%;
          animation: captchaSpin 0.8s linear infinite;
        }

        .g2g-captcha-text {
          font-size: 13px;
          color: #d1d5db;
        }

        .g2g-captcha-logo-section {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          font-size: 9px;
          color: #9ea2a9;
        }

        .g2g-captcha-logo-text {
          font-weight: 700;
          color: #ffffff;
          letter-spacing: 0.5px;
          font-size: 11px;
        }

        .g2g-captcha-logo-sub {
          display: flex;
          gap: 4px;
        }

        .g2g-captcha-logo-sub a {
          color: #9ea2a9;
          text-decoration: none;
        }

        @keyframes captchaSpin {
          to { transform: rotate(360deg); }
        }

        .g2g-login-logo-container {
          margin-bottom: 20px;
          display: flex;
          align-items: center;
          gap: 10px;
          color: #ffffff;
          font-size: 32px;
          font-weight: 800;
          letter-spacing: -0.5px;
        }

        .g2g-login-logo-box {
          background-color: #ffffff;
          color: #ff3333;
          width: 42px;
          height: 42px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 900;
          font-size: 24px;
        }

        .g2g-login-card {
          background-color: #1f2125;
          border: 1px solid #2d2f34;
          border-radius: 16px;
          width: 100%;
          max-width: 460px;
          padding: 36px 36px 28px 36px;
          box-shadow: 0 12px 40px rgba(0, 0, 0, 0.6);
          box-sizing: border-box;
          animation: g2gSlideUp 0.35s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .g2g-login-title {
          color: #ffffff;
          font-size: 22px;
          font-weight: 700;
          text-align: center;
          margin-top: 0;
          margin-bottom: 28px;
        }

        .g2g-login-form-group {
          margin-bottom: 18px;
          position: relative;
        }

        .g2g-login-label {
          display: block;
          color: #9ea2a9;
          font-size: 13px;
          font-weight: 500;
          margin-bottom: 8px;
        }

        .g2g-login-input-wrapper {
          position: relative;
        }

        .g2g-login-input {
          width: 100%;
          background-color: #131416;
          border: 1px solid #2d2f34;
          border-radius: 6px;
          color: #ffffff;
          padding: 12px 16px;
          font-size: 14px;
          box-sizing: border-box;
          transition: all 0.2s ease;
        }

        .g2g-login-input:focus {
          outline: none;
          border-color: #ff3333;
          background-color: #0b0c0d;
        }

        .g2g-login-input.error {
          border-color: #ff3b30;
        }

        .g2g-login-error-text {
          color: #ff3b30;
          font-size: 12px;
          margin-top: 6px;
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .g2g-login-toggle-password {
          position: absolute;
          right: 14px;
          top: 50%;
          transform: translateY(-50%);
          color: #9ea2a9;
          cursor: pointer;
          background: none;
          border: none;
          padding: 0;
          font-size: 16px;
          display: flex;
          align-items: center;
          transition: color 0.2s;
        }
        
        .g2g-login-toggle-password:hover {
          color: #ffffff;
        }

        .g2g-login-options {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
          font-size: 13px;
        }

        .g2g-login-remember {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #9ea2a9;
          cursor: pointer;
          user-select: none;
        }

        .g2g-login-remember input {
          accent-color: #ff3333;
          width: 16px;
          height: 16px;
          cursor: pointer;
        }

        .g2g-login-trouble {
          color: #ffffff;
          text-decoration: underline;
          cursor: pointer;
        }

        .g2g-login-buttons {
          display: flex;
          gap: 12px;
          margin-bottom: 24px;
        }

        .g2g-login-btn-later {
          flex: 1;
          background-color: transparent;
          border: 1px solid #2d2f34;
          border-radius: 6px;
          color: #ffffff;
          padding: 12px;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          transition: background-color 0.2s;
          text-align: center;
        }

        .g2g-login-btn-later:hover {
          background-color: #2b2d31;
        }

        .g2g-login-btn-submit {
          flex: 1;
          background-color: #ff3333;
          border: none;
          border-radius: 6px;
          color: #ffffff;
          padding: 12px;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          transition: background-color 0.2s;
          text-align: center;
        }

        .g2g-login-btn-submit:hover {
          background-color: #e02b2b;
        }

        .g2g-login-divider {
          display: flex;
          align-items: center;
          text-align: center;
          color: #5d6168;
          font-size: 12px;
          margin-bottom: 20px;
        }

        .g2g-login-divider::before,
        .g2g-login-divider::after {
          content: '';
          flex: 1;
          border-bottom: 1px solid #2d2f34;
        }

        .g2g-login-divider:not(:empty)::before {
          margin-right: .75em;
        }

        .g2g-login-divider:not(:empty)::after {
          margin-left: .75em;
        }

        .g2g-login-socials {
          display: flex;
          justify-content: center;
          gap: 12px;
          margin-bottom: 24px;
          flex-wrap: wrap;
        }

        .g2g-login-social-btn {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          border: none;
          transition: opacity 0.2s, transform 0.1s;
        }

        .g2g-login-social-btn:hover {
          opacity: 0.9;
          transform: scale(1.05);
        }

        .g2g-login-footer {
          text-align: center;
          font-size: 13px;
          color: #9ea2a9;
        }

        .g2g-login-link-action {
          color: #196bf7;
          font-weight: 600;
          cursor: pointer;
          text-decoration: none;
        }

        .g2g-login-link-action:hover {
          text-decoration: underline;
        }

        @keyframes g2gFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes g2gSlideUp {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>

      {(activeModal === 'login' || activeModal === 'signup') && (
        <div className="g2g-login-overlay">
          {/* Logo Section */}
          <div className="g2g-login-logo-container">
            <span className="g2g-login-logo-box">G</span>
            <span>G2G.</span>
          </div>

          {activeModal === 'login' ? (
            /* Login Card */
            <div className="g2g-login-card">
              <h3 className="g2g-login-title">Chào mừng trở lại!</h3>
              <form onSubmit={onLocalLoginSubmit} noValidate>
                <div className="g2g-login-form-group">
                  <label className="g2g-login-label">E-mail hoặc số điện thoại di động</label>
                  <div className="g2g-login-input-wrapper">
                    <input
                      type="text"
                      className={`g2g-login-input ${loginEmailError ? 'error' : ''}`}
                      placeholder="Email hoặc số điện thoại"
                      value={loginEmail}
                      onChange={(e) => {
                        setLoginEmail(e.target.value);
                        if (e.target.value) setLoginEmailError('');
                      }}
                      required
                    />
                  </div>
                  {loginEmailError && (
                    <div className="g2g-login-error-text">
                      <span>⚠️ {loginEmailError}</span>
                    </div>
                  )}
                </div>

                <div className="g2g-login-form-group">
                  <label className="g2g-login-label">Mật khẩu</label>
                  <div className="g2g-login-input-wrapper">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      className={`g2g-login-input ${loginPasswordError ? 'error' : ''}`}
                      placeholder="••••••••"
                      value={loginPassword}
                      onChange={(e) => {
                        setLoginPassword(e.target.value);
                        if (e.target.value) setLoginPasswordError('');
                      }}
                      required
                    />
                    <button
                      type="button"
                      className="g2g-login-toggle-password"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        /* Eye Open */
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                          <circle cx="12" cy="12" r="3" />
                        </svg>
                      ) : (
                        /* Eye Closed */
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                          <line x1="1" y1="1" x2="23" y2="23" />
                        </svg>
                      )}
                    </button>
                  </div>
                  {loginPasswordError && (
                    <div className="g2g-login-error-text">
                      <span>⚠️ {loginPasswordError}</span>
                    </div>
                  )}
                </div>

                <div className="g2g-login-options">
                  <label className="g2g-login-remember">
                    <input type="checkbox" />
                    <span>Nhớ tôi</span>
                  </label>
                  <span
                    className="g2g-login-trouble"
                    onClick={() => triggerToast && triggerToast('Mã khôi phục đã gửi qua email!')}
                  >
                    Gặp sự cố khi đăng nhập?
                  </span>
                </div>

                <div className="g2g-login-buttons">
                  <button type="button" className="g2g-login-btn-later" onClick={() => setActiveModal(null)}>
                    Sau
                  </button>
                  <button type="submit" className="g2g-login-btn-submit">
                    Đăng nhập
                  </button>
                </div>
              </form>

              <div className="g2g-login-divider">hoặc Đăng nhập với</div>

              {/* Social Login Circles */}
              <div className="g2g-login-socials">
                {/* Facebook */}
                <button className="g2g-login-social-btn" style={{ backgroundColor: '#1877F2' }} onClick={() => handleSocialClick('Facebook')}>
                  <svg width="20" height="20" fill="white" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </button>
                {/* Google */}
                <button className="g2g-login-social-btn" style={{ backgroundColor: '#ffffff', border: '1px solid #dcdcdc' }} onClick={() => handleSocialClick('Google')}>
                  <svg width="20" height="20" viewBox="0 0 24 24">
                    <path fill="#EA4335" d="M12 5.04c1.62 0 3.08.56 4.22 1.64l3.15-3.15C17.45 1.7 14.94 1 12 1 7.35 1 3.37 3.65 1.39 7.56l3.87 3A7 7 0 0 1 12 5.04z"/>
                    <path fill="#4285F4" d="M23.49 12.27c0-.8-.07-1.57-.2-2.32H12v4.51h6.46a5.54 5.54 0 0 1-2.4 3.65v3.02h3.87c2.26-2.08 3.56-5.14 3.56-8.86z"/>
                    <path fill="#FBBC05" d="M5.26 14.44a7 7 0 0 1 0-4.88l-3.87-3a11.96 11.96 0 0 0 0 10.88l3.87-3z"/>
                    <path fill="#34A853" d="M12 23c3.24 0 5.97-1.07 7.96-2.91l-3.87-3.02c-1.08.72-2.46 1.15-4.09 1.15-3.16 0-5.83-2.14-6.79-5.02l-3.87 3A11 11 0 0 0 12 23z"/>
                  </svg>
                </button>
                {/* TikTok */}
                <button className="g2g-login-social-btn" style={{ backgroundColor: '#000000' }} onClick={() => handleSocialClick('TikTok')}>
                  <svg width="18" height="18" fill="white" viewBox="0 0 24 24">
                    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.02 1.63 4.14.99 1.12 2.37 1.83 3.86 2.05v3.86c-1.4-.04-2.77-.47-3.95-1.25-.79-.53-1.46-1.24-1.95-2.07v7.65c.04 1.85-.49 3.68-1.54 5.18-1.44 2.06-3.8 3.32-6.3 3.38-2.67.07-5.26-1.12-6.85-3.26-1.57-2.11-1.98-4.97-1.09-7.44.86-2.39 2.87-4.21 5.3-4.78.96-.23 1.95-.27 2.93-.11v3.91c-.8-.21-1.64-.15-2.4.19-.89.39-1.58 1.15-1.88 2.08-.34 1.05-.15 2.21.5 3.08.76 1.03 2.02 1.6 3.29 1.48 1.33-.12 2.47-.99 2.91-2.25.17-.5.23-1.03.22-1.56V0z"/>
                  </svg>
                </button>
                {/* X / Twitter */}
                <button className="g2g-login-social-btn" style={{ backgroundColor: '#000000' }} onClick={() => handleSocialClick('X')}>
                  <svg width="16" height="16" fill="white" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                </button>
                {/* PayPal */}
                <button className="g2g-login-social-btn" style={{ backgroundColor: '#003087' }} onClick={() => handleSocialClick('PayPal')}>
                  <svg width="18" height="18" fill="white" viewBox="0 0 24 24">
                    <path d="M20.03 6.645c-.295 2.91-2.28 4.785-5.325 4.785H11.58l-1.05 6.6h-3.48l2.67-16.71c.075-.48.495-.825.99-.825h5.4c1.86 0 3.255.45 3.96 1.35.63.795.69 1.86.375 2.985v.015zm-3.51.15c.12-.99-.48-1.59-1.59-1.59H12.24l-.615 3.84H14.1c1.23 0 2.205-.555 2.415-2.25h.005zM17.07 10.95c-.225 2.19-1.725 3.585-4.02 3.585h-2.1l-.81 5.085H6.66l2.355-14.82h3.765c1.41 0 2.475.345 3.015 1.02.48.6.525 1.41.285 2.25-.225 2.19-1.725 3.585-4.02 3.585z"/>
                  </svg>
                </button>
                {/* Instagram */}
                <button className="g2g-login-social-btn" style={{ background: 'radial-gradient(circle at 30% 107%, #fdf497 0%, #fdf497 5%, #fd5949 45%,#d6249f 60%,#285ae5 90%)' }} onClick={() => handleSocialClick('Instagram')}>
                  <svg width="20" height="20" fill="white" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/>
                  </svg>
                </button>
                {/* Weibo */}
                <button className="g2g-login-social-btn" style={{ backgroundColor: '#E6162D' }} onClick={() => handleSocialClick('Weibo')}>
                  <svg width="20" height="20" fill="white" viewBox="0 0 24 24">
                    <path d="M10.02 17.58c-3.18-.08-5.91-1.39-6.1-2.92-.19-1.53 2.19-2.92 5.37-2.92s5.86 1.23 6.05 2.76c.19 1.53-2.14 3.16-5.32 3.08zm8.79-7.9c-.38-.45-1.02-.6-1.57-.4-.32.12-.57.36-.7.67-.18.42-.1.9.18 1.23.36.42 1.01.55 1.55.35.31-.12.56-.36.68-.66.19-.44.09-.92-.2-1.24a3.1 3.1 0 0 0-1.74-.75c-.32.02-.6.2-.74.49-.1.21-.08.47.05.66.12.18.34.28.56.26.47-.04.91.2 1.08.64.13.33-.03.71-.37.85-.34.14-.73-.01-.89-.35l-.04-.1c-.13-.3-.42-.51-.75-.54a.8.8 0 0 0-.82.68c-.06.33.1.66.4.82.72.37 1.58.26 2.18-.28.47-.41.64-1.04.45-1.63zM12 9.17c-.36 0-.71.07-1.04.22L7.38 7.21c-.42-.23-.95-.12-1.24.27a.9.9 0 0 0 .15 1.22l2.36 1.77A4.6 4.6 0 0 0 7.37 14c0 2.5 3.06 4.54 6.83 4.54s6.83-2.04 6.83-4.54c0-2.45-2.97-4.47-6.68-4.53-.12-.3-.18-.62-.18-.94a2.7 2.7 0 0 1 .83-1.92c.35-.35.83-.55 1.34-.55.51 0 .99.2 1.34.55.35.35.55.83.55 1.34 0 .32-.08.64-.24.91l2.45 1.83a.9.9 0 0 0 1.22-.15.9.9 0 0 0-.15-1.22l-2.02-1.51a4.5 4.5 0 0 0-3.32-1.42z"/>
                  </svg>
                </button>
                {/* Twitch */}
                <button className="g2g-login-social-btn" style={{ backgroundColor: '#9146FF' }} onClick={() => handleSocialClick('Twitch')}>
                  <svg width="18" height="18" fill="white" viewBox="0 0 24 24">
                    <path d="M11.571 4.714h1.715v5.143H11.57zm3.002 0H16.29v5.143h-1.716zm-12 1.286v13.714h3.857v3.428l3.429-3.428h2.571l6.857-6.857V6zm14.57 9.857l-3 3h-2.571l-3.429 3.429v-3.429H7.286V2.143h11.142z"/>
                  </svg>
                </button>
              </div>

              <div className="g2g-login-footer">
                Mới đến G2G?{' '}
                <span className="g2g-login-link-action" onClick={() => {
                  setActiveModal('signup');
                  setLoginEmailError('');
                  setLoginPasswordError('');
                }}>
                  Đăng ký
                </span>
              </div>
            </div>
          ) : (
            /* Signup Card with tabs */
            <div className="g2g-login-card" style={{ padding: '0 0 28px 0', overflow: 'hidden' }}>
              {/* Tabs */}
              <div className="g2g-signup-tabs">
                <button
                  type="button"
                  className={`g2g-signup-tab ${signupTab === 'regular' ? 'active' : ''}`}
                  onClick={() => setSignupTab('regular')}
                >
                  👤 Cá Nhân (Mua Hàng)
                </button>
                <button
                  type="button"
                  className={`g2g-signup-tab ${signupTab === 'business' ? 'active' : ''}`}
                  onClick={() => setSignupTab('business')}
                >
                  💼 Doanh Nghiệp (Bán Hàng)
                </button>
              </div>

              <div style={{ padding: '0 36px' }}>
                {signupTab === 'regular' ? (
                  /* Regular Registration Form */
                  signupStep === 1 ? (
                    /* Step 1: Phone number & Captcha */
                    <form onSubmit={onRegularSignupStep1Submit} noValidate>
                      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                        <h4 style={{ color: '#ffffff', fontSize: '16px', fontWeight: 700 }}>Đăng Ký Tài Khoản Cá Nhân</h4>
                        <p style={{ color: '#9ea2a9', fontSize: '12px', marginTop: '4px' }}>Dành cho khách hàng muốn giao dịch và mua sắm trên chợ game G2G</p>
                      </div>
                      <div className="g2g-login-form-group">
                        <label className="g2g-login-label">Số điện thoại hoặc Địa chỉ E-mail (Gmail)</label>
                        <div className="g2g-login-input-wrapper">
                          <input
                            type="text"
                            className={`g2g-login-input ${signupContactError ? 'error' : ''}`}
                            placeholder="Nhập Gmail hoặc số điện thoại của bạn..."
                            value={signupContact}
                            onChange={(e) => {
                              setSignupContact(e.target.value);
                              if (e.target.value) setSignupContactError('');
                            }}
                            required
                          />
                        </div>
                        {signupContactError && (
                          <div className="g2g-login-error-text">
                            <span>⚠️ {signupContactError}</span>
                          </div>
                        )}
                      </div>

                      {/* Turnstile Captcha Simulator */}
                      <div className="g2g-captcha-box" onClick={handleCaptchaClick}>
                        <div className="g2g-captcha-left">
                          <div className={`g2g-captcha-checkbox ${captchaState === 'verified' ? 'verified' : ''}`}>
                            {captchaState === 'checking' && <div className="g2g-captcha-spinner"></div>}
                            {captchaState === 'verified' && (
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                                <path d="M20 6L9 17L4 12" />
                              </svg>
                            )}
                          </div>
                          <span className="g2g-captcha-text">
                            {captchaState === 'unchecked' && 'Bấm vào đây để xác minh'}
                            {captchaState === 'checking' && 'Đang xác minh bảo mật...'}
                            {captchaState === 'verified' && 'Success!'}
                          </span>
                        </div>
                        <div className="g2g-captcha-logo-section">
                          <span className="g2g-captcha-logo-text">CLOUDFLARE</span>
                          <div className="g2g-captcha-logo-sub">
                            <a href="#privacy" onClick={(e) => e.stopPropagation()}>Privacy</a>
                            <span>•</span>
                            <a href="#help" onClick={(e) => e.stopPropagation()}>Help</a>
                          </div>
                        </div>
                      </div>
                      {captchaError && (
                        <div className="g2g-login-error-text" style={{ marginBottom: '16px', marginTop: '-12px' }}>
                          <span>⚠️ {captchaError}</span>
                        </div>
                      )}

                      {/* Terms Agree checkbox */}
                      <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', alignItems: 'flex-start' }}>
                        <input
                          type="checkbox"
                          id="termsAgree"
                          checked={termsChecked}
                          onChange={(e) => {
                            setTermsChecked(e.target.checked);
                            if (e.target.checked) setTermsCheckedError('');
                          }}
                          style={{ marginTop: '3px', accentColor: '#ff3333', cursor: 'pointer' }}
                        />
                        <label htmlFor="termsAgree" style={{ fontSize: '12px', color: '#9ea2a9', lineHeight: 1.4, cursor: 'pointer' }}>
                          Tôi đã đọc và đồng ý với{' '}
                          <a href="#terms" style={{ color: '#ff3333', textDecoration: 'underline' }}>Điều khoản Dịch vụ</a> và{' '}
                          <a href="#privacy" style={{ color: '#ff3333', textDecoration: 'underline' }}>Chính sách Bảo mật</a> của G2G.
                        </label>
                      </div>
                      {termsCheckedError && (
                        <div className="g2g-login-error-text" style={{ marginBottom: '16px', marginTop: '-16px' }}>
                          <span>⚠️ {termsCheckedError}</span>
                        </div>
                      )}

                      {/* Step 1 Actions */}
                      <div className="g2g-login-buttons">
                        <button type="button" className="g2g-login-btn-later" onClick={() => setActiveModal(null)}>
                          Sau
                        </button>
                        <button type="submit" className="g2g-login-btn-submit">
                          Tiếp tục
                        </button>
                      </div>
                    </form>
                  ) : (
                    /* Step 2: OTP Verification & Password Setup */
                    <form onSubmit={onRegularSignupStep2Submit} noValidate>
                      <h4 style={{ color: '#ffffff', fontSize: '14px', marginBottom: '16px', fontWeight: 600 }}>
                        Xác thực tài khoản: <span style={{ color: '#ff3333' }}>{signupMethod === 'phone' ? `${countryCode} ${phoneNum}` : signupEmailLoc}</span>
                      </h4>

                      <div className="g2g-login-form-group">
                        <label className="g2g-login-label">Mã xác thực OTP gửi qua {signupMethod === 'phone' ? 'SMS' : 'Email'} (6 chữ số)</label>
                        <div className="g2g-login-input-wrapper" style={{ display: 'flex', gap: '8px' }}>
                          <input
                            type="text"
                            maxLength="6"
                            className={`g2g-login-input ${otpValError ? 'error' : ''}`}
                            placeholder="Nhập 6 số"
                            value={otpVal}
                            onChange={(e) => {
                              setOtpVal(e.target.value.replace(/\D/g, ''));
                              if (e.target.value) setOtpValError('');
                            }}
                            style={{ flex: '1' }}
                            required
                          />
                          <button
                            type="button"
                            className="g2g-login-btn-later"
                            style={{ padding: '0 12px', fontSize: '12px', flex: 'initial', whiteSpace: 'nowrap' }}
                            onClick={handleSendOtp}
                          >
                            Gửi lại mã
                          </button>
                        </div>
                        {otpValError && (
                          <div className="g2g-login-error-text">
                            <span>⚠️ {otpValError}</span>
                          </div>
                        )}
                      </div>

                      <div className="g2g-login-form-group">
                        <label className="g2g-login-label">Tên hiển thị</label>
                        <div className="g2g-login-input-wrapper">
                          <input
                            type="text"
                            className={`g2g-login-input ${signupNameLocError ? 'error' : ''}`}
                            placeholder="Ví dụ: gamer_pro102"
                            value={signupNameLoc}
                            onChange={(e) => {
                              setSignupNameLoc(e.target.value);
                              if (e.target.value) setSignupNameLocError('');
                            }}
                            required
                          />
                        </div>
                        {signupNameLocError && (
                          <div className="g2g-login-error-text">
                            <span>⚠️ {signupNameLocError}</span>
                          </div>
                        )}
                      </div>

                      <div className="g2g-login-form-group">
                        <label className="g2g-login-label">Mật khẩu</label>
                        <div className="g2g-login-input-wrapper">
                          <input
                            type={showSignupPasswordLoc ? 'text' : 'password'}
                            className={`g2g-login-input ${signupPasswordLocError ? 'error' : ''}`}
                            placeholder="••••••••"
                            value={signupPasswordLoc}
                            onChange={(e) => {
                              setSignupPasswordLoc(e.target.value);
                              if (e.target.value) setSignupPasswordLocError('');
                            }}
                            required
                          />
                          <button
                            type="button"
                            className="g2g-login-toggle-password"
                            onClick={() => setShowSignupPasswordLoc(!showSignupPasswordLoc)}
                          >
                            {showSignupPasswordLoc ? (
                              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                <circle cx="12" cy="12" r="3" />
                              </svg>
                            ) : (
                              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                                <line x1="1" y1="1" x2="23" y2="23" />
                              </svg>
                            )}
                          </button>
                        </div>
                        {signupPasswordLocError && (
                          <div className="g2g-login-error-text">
                            <span>⚠️ {signupPasswordLocError}</span>
                          </div>
                        )}
                      </div>

                      {/* Step 2 Actions */}
                      <div className="g2g-login-buttons">
                        <button type="button" className="g2g-login-btn-later" onClick={() => setSignupStep(1)}>
                          Quay lại
                        </button>
                        <button type="submit" className="g2g-login-btn-submit">
                          Đăng ký
                        </button>
                      </div>
                    </form>
                  )
                ) : (
                  /* Business Registration Form */
                  <form onSubmit={onBusinessSignupSubmit} noValidate>
                    <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                      <h4 style={{ color: '#ffffff', fontSize: '16px', fontWeight: 700 }}>Đăng Ký Tài Khoản Doanh Nghiệp</h4>
                      <p style={{ color: '#9ea2a9', fontSize: '12px', marginTop: '4px' }}>Dành cho các doanh nghiệp, đại lý game muốn bán hàng chuyên nghiệp</p>
                    </div>
                    <div className="g2g-login-form-group">
                      <label className="g2g-login-label">Tên công ty / doanh nghiệp</label>
                      <div className="g2g-login-input-wrapper">
                        <input
                          type="text"
                          className={`g2g-login-input ${bizNameError ? 'error' : ''}`}
                          placeholder="Công ty TNHH dịch vụ Game G2G"
                          value={bizName}
                          onChange={(e) => {
                            setBizName(e.target.value);
                            if (e.target.value) setBizNameError('');
                          }}
                          required
                        />
                      </div>
                      {bizNameError && (
                        <div className="g2g-login-error-text">
                          <span>⚠️ {bizNameError}</span>
                        </div>
                      )}
                    </div>

                    <div className="g2g-login-form-group">
                      <label className="g2g-login-label">Mã số thuế / Số ĐKKD</label>
                      <div className="g2g-login-input-wrapper">
                        <input
                          type="text"
                          className={`g2g-login-input ${bizTaxIdError ? 'error' : ''}`}
                          placeholder="0101234567"
                          value={bizTaxId}
                          onChange={(e) => {
                            setBizTaxId(e.target.value);
                            if (e.target.value) setBizTaxIdError('');
                          }}
                          required
                        />
                      </div>
                      {bizTaxIdError && (
                        <div className="g2g-login-error-text">
                          <span>⚠️ {bizTaxIdError}</span>
                        </div>
                      )}
                    </div>

                    <div className="g2g-login-form-group">
                      <label className="g2g-login-label">E-mail doanh nghiệp</label>
                      <div className="g2g-login-input-wrapper">
                        <input
                          type="email"
                          className={`g2g-login-input ${bizEmailError ? 'error' : ''}`}
                          placeholder="contact@company.com"
                          value={bizEmail}
                          onChange={(e) => {
                            setBizEmail(e.target.value);
                            if (e.target.value) setBizEmailError('');
                          }}
                          required
                        />
                      </div>
                      {bizEmailError && (
                        <div className="g2g-login-error-text">
                          <span>⚠️ {bizEmailError}</span>
                        </div>
                      )}
                    </div>

                    <div className="g2g-login-form-group">
                      <label className="g2g-login-label">Số điện thoại đại diện</label>
                      <div className="g2g-phone-input-group">
                        <select
                          className="g2g-country-select"
                          value={countryCode}
                          onChange={(e) => setCountryCode(e.target.value)}
                        >
                          <option value="+84">🇻🇳 +84</option>
                          <option value="+1">🇺🇸 +1</option>
                          <option value="+86">🇨🇳 +86</option>
                          <option value="+65">🇸🇬 +65</option>
                        </select>
                        <input
                          type="tel"
                          className="g2g-phone-raw-input"
                          placeholder="Nhập số điện thoại"
                          value={bizPhone}
                          onChange={(e) => {
                            setBizPhone(e.target.value.replace(/\D/g, ''));
                            if (e.target.value) setBizPhoneError('');
                          }}
                          required
                        />
                      </div>
                      {bizPhoneError && (
                        <div className="g2g-login-error-text">
                          <span>⚠️ {bizPhoneError}</span>
                        </div>
                      )}
                    </div>

                    <div className="g2g-login-form-group">
                      <label className="g2g-login-label">Mật khẩu tài khoản</label>
                      <div className="g2g-login-input-wrapper">
                        <input
                          type={showBizPassword ? 'text' : 'password'}
                          className={`g2g-login-input ${bizPasswordError ? 'error' : ''}`}
                          placeholder="••••••••"
                          value={bizPassword}
                          onChange={(e) => {
                            setBizPassword(e.target.value);
                            if (e.target.value) setBizPasswordError('');
                          }}
                          required
                        />
                        <button
                          type="button"
                          className="g2g-login-toggle-password"
                          onClick={() => setShowBizPassword(!showBizPassword)}
                        >
                          {showBizPassword ? (
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                              <circle cx="12" cy="12" r="3" />
                            </svg>
                          ) : (
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                              <line x1="1" y1="1" x2="23" y2="23" />
                            </svg>
                          )}
                        </button>
                      </div>
                      {bizPasswordError && (
                        <div className="g2g-login-error-text">
                          <span>⚠️ {bizPasswordError}</span>
                        </div>
                      )}
                    </div>

                    {/* Turnstile Captcha Simulator */}
                    <div className="g2g-captcha-box" onClick={handleCaptchaClick}>
                      <div className="g2g-captcha-left">
                        <div className={`g2g-captcha-checkbox ${captchaState === 'verified' ? 'verified' : ''}`}>
                          {captchaState === 'checking' && <div className="g2g-captcha-spinner"></div>}
                          {captchaState === 'verified' && (
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                              <path d="M20 6L9 17L4 12" />
                            </svg>
                          )}
                        </div>
                        <span className="g2g-captcha-text">
                          {captchaState === 'unchecked' && 'Bấm vào đây để xác minh'}
                          {captchaState === 'checking' && 'Đang xác minh bảo mật...'}
                          {captchaState === 'verified' && 'Success!'}
                        </span>
                      </div>
                      <div className="g2g-captcha-logo-section">
                        <span className="g2g-captcha-logo-text">CLOUDFLARE</span>
                        <div className="g2g-captcha-logo-sub">
                          <a href="#privacy" onClick={(e) => e.stopPropagation()}>Privacy</a>
                          <span>•</span>
                          <a href="#help" onClick={(e) => e.stopPropagation()}>Help</a>
                        </div>
                      </div>
                    </div>
                    {captchaError && (
                      <div className="g2g-login-error-text" style={{ marginBottom: '16px', marginTop: '-12px' }}>
                        <span>⚠️ {captchaError}</span>
                      </div>
                    )}

                    {/* Business Terms Agree checkbox */}
                    <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', alignItems: 'flex-start' }}>
                      <input
                        type="checkbox"
                        id="bizTermsAgree"
                        checked={bizTermsChecked}
                        onChange={(e) => {
                          setBizTermsChecked(e.target.checked);
                          if (e.target.checked) setBizTermsCheckedError('');
                        }}
                        style={{ marginTop: '3px', accentColor: '#ff3333', cursor: 'pointer' }}
                      />
                      <label htmlFor="bizTermsAgree" style={{ fontSize: '12px', color: '#9ea2a9', lineHeight: 1.4, cursor: 'pointer' }}>
                        Tôi đại diện doanh nghiệp đồng ý với <a href="#terms" style={{ color: '#ff3333', textDecoration: 'underline' }}>Điều khoản hoạt động doanh nghiệp</a> và <a href="#privacy" style={{ color: '#ff3333', textDecoration: 'underline' }}>Chính sách bảo mật thông tin</a> của G2G.
                      </label>
                    </div>
                    {bizTermsCheckedError && (
                      <div className="g2g-login-error-text" style={{ marginBottom: '16px', marginTop: '-16px' }}>
                        <span>⚠️ {bizTermsCheckedError}</span>
                      </div>
                    )}

                    {/* Step Actions */}
                    <div className="g2g-login-buttons">
                      <button type="button" className="g2g-login-btn-later" onClick={() => setActiveModal(null)}>
                        Sau
                      </button>
                      <button type="submit" className="g2g-login-btn-submit">
                        Tiếp tục
                      </button>
                    </div>
                  </form>
                )}

                {/* Social logins for Step 1 only */}
                {((signupTab === 'regular' && signupStep === 1) || signupTab === 'business') && (
                  <>
                    <div className="g2g-login-divider">hoặc Đăng ký với</div>
                    <div className="g2g-login-socials">
                      <button className="g2g-login-social-btn" style={{ backgroundColor: '#1877F2' }} onClick={() => handleSocialClick('Facebook')}>
                        <svg width="20" height="20" fill="white" viewBox="0 0 24 24">
                          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                        </svg>
                      </button>
                      <button className="g2g-login-social-btn" style={{ backgroundColor: '#ffffff', border: '1px solid #dcdcdc' }} onClick={() => handleSocialClick('Google')}>
                        <svg width="20" height="20" viewBox="0 0 24 24">
                          <path fill="#EA4335" d="M12 5.04c1.62 0 3.08.56 4.22 1.64l3.15-3.15C17.45 1.7 14.94 1 12 1 7.35 1 3.37 3.65 1.39 7.56l3.87 3A7 7 0 0 1 12 5.04z"/>
                          <path fill="#4285F4" d="M23.49 12.27c0-.8-.07-1.57-.2-2.32H12v4.51h6.46a5.54 5.54 0 0 1-2.4 3.65v3.02h3.87c2.26-2.08 3.56-5.14 3.56-8.86z"/>
                          <path fill="#FBBC05" d="M5.26 14.44a7 7 0 0 1 0-4.88l-3.87-3a11.96 11.96 0 0 0 0 10.88l3.87-3z"/>
                          <path fill="#34A853" d="M12 23c3.24 0 5.97-1.07 7.96-2.91l-3.87-3.02c-1.08.72-2.46 1.15-4.09 1.15-3.16 0-5.83-2.14-6.79-5.02l-3.87 3A11 11 0 0 0 12 23z"/>
                        </svg>
                      </button>
                      <button className="g2g-login-social-btn" style={{ backgroundColor: '#000000' }} onClick={() => handleSocialClick('TikTok')}>
                        <svg width="18" height="18" fill="white" viewBox="0 0 24 24">
                          <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.02 1.63 4.14.99 1.12 2.37 1.83 3.86 2.05v3.86c-1.4-.04-2.77-.47-3.95-1.25-.79-.53-1.46-1.24-1.95-2.07v7.65c.04 1.85-.49 3.68-1.54 5.18-1.44 2.06-3.8 3.32-6.3 3.38-2.67.07-5.26-1.12-6.85-3.26-1.57-2.11-1.98-4.97-1.09-7.44.86-2.39 2.87-4.21 5.3-4.78.96-.23 1.95-.27 2.93-.11v3.91c-.8-.21-1.64-.15-2.4.19-.89.39-1.58 1.15-1.88 2.08-.34 1.05-.15 2.21.5 3.08.76 1.03 2.02 1.6 3.29 1.48 1.33-.12 2.47-.99 2.91-2.25.17-.5.23-1.03.22-1.56V0z"/>
                        </svg>
                      </button>
                      <button className="g2g-login-social-btn" style={{ backgroundColor: '#000000' }} onClick={() => handleSocialClick('X')}>
                        <svg width="16" height="16" fill="white" viewBox="0 0 24 24">
                          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                        </svg>
                      </button>
                      <button className="g2g-login-social-btn" style={{ backgroundColor: '#003087' }} onClick={() => handleSocialClick('PayPal')}>
                        <svg width="18" height="18" fill="white" viewBox="0 0 24 24">
                          <path d="M20.03 6.645c-.295 2.91-2.28 4.785-5.325 4.785H11.58l-1.05 6.6h-3.48l2.67-16.71c.075-.48.495-.825.99-.825h5.4c1.86 0 3.255.45 3.96 1.35.63.795.69 1.86.375 2.985v.015zm-3.51.15c.12-.99-.48-1.59-1.59-1.59H12.24l-.615 3.84H14.1c1.23 0 2.205-.555 2.415-2.25h.005zM17.07 10.95c-.225 2.19-1.725 3.585-4.02 3.585h-2.1l-.81 5.085H6.66l2.355-14.82h3.765c1.41 0 2.475.345 3.015 1.02.48.6.525 1.41.285 2.25-.225 2.19-1.725 3.585-4.02 3.585z"/>
                        </svg>
                      </button>
                      <button className="g2g-login-social-btn" style={{ background: 'radial-gradient(circle at 30% 107%, #fdf497 0%, #fdf497 5%, #fd5949 45%,#d6249f 60%,#285ae5 90%)' }} onClick={() => handleSocialClick('Instagram')}>
                        <svg width="20" height="20" fill="white" viewBox="0 0 24 24">
                          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/>
                        </svg>
                      </button>
                      <button className="g2g-login-social-btn" style={{ backgroundColor: '#E6162D' }} onClick={() => handleSocialClick('Weibo')}>
                        <svg width="20" height="20" fill="white" viewBox="0 0 24 24">
                          <path d="M10.02 17.58c-3.18-.08-5.91-1.39-6.1-2.92-.19-1.53 2.19-2.92 5.37-2.92s5.86 1.23 6.05 2.76c.19 1.53-2.14 3.16-5.32 3.08zm8.79-7.9c-.38-.45-1.02-.6-1.57-.4-.32.12-.57.36-.7.67-.18.42-.1.9.18 1.23.36.42 1.01.55 1.55.35.31-.12.56-.36.68-.66.19-.44.09-.92-.2-1.24a3.1 3.1 0 0 0-1.74-.75c-.32.02-.6.2-.74.49-.1.21-.08.47.05.66.12.18.34.28.56.26.47-.04.91.2 1.08.64.13.33-.03.71-.37.85-.34.14-.73-.01-.89-.35l-.04-.1c-.13-.3-.42-.51-.75-.54a.8.8 0 0 0-.82.68c-.06.33.1.66.4.82.72.37 1.58.26 2.18-.28.47-.41.64-1.04.45-1.63zM12 9.17c-.36 0-.71.07-1.04.22L7.38 7.21c-.42-.23-.95-.12-1.24.27a.9.9 0 0 0 .15 1.22l2.36 1.77A4.6 4.6 0 0 0 7.37 14c0 2.5 3.06 4.54 6.83 4.54s6.83-2.04 6.83-4.54c0-2.45-2.97-4.47-6.68-4.53-.12-.3-.18-.62-.18-.94a2.7 2.7 0 0 1 .83-1.92c.35-.35.83-.55 1.34-.55.51 0 .99.2 1.34.55.35.35.55.83.55 1.34 0 .32-.08.64-.24.91l2.45 1.83a.9.9 0 0 0 1.22-.15.9.9 0 0 0-.15-1.22l-2.02-1.51a4.5 4.5 0 0 0-3.32-1.42z"/>
                        </svg>
                      </button>
                      <button className="g2g-login-social-btn" style={{ backgroundColor: '#9146FF' }} onClick={() => handleSocialClick('Twitch')}>
                        <svg width="18" height="18" fill="white" viewBox="0 0 24 24">
                          <path d="M11.571 4.714h1.715v5.143H11.57zm3.002 0H16.29v5.143h-1.716zm-12 1.286v13.714h3.857v3.428l3.429-3.428h2.571l6.857-6.857V6zm14.57 9.857l-3 3h-2.571l-3.429 3.429v-3.429H7.286V2.143h11.142z"/>
                        </svg>
                      </button>
                    </div>
                  </>
                )}

                <div className="g2g-login-footer" style={{ marginTop: '20px' }}>
                  Chào mừng trở lại!{' '}
                  <span className="g2g-login-link-action" onClick={() => {
                    setActiveModal('login');
                  }}>
                    Đăng nhập
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Become a Seller Modal - styled consistently with the dark theme */}
      {activeModal === 'seller' && (
        <div className="modal-overlay" onClick={() => setActiveModal(null)} style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(6px)' }}>
          <div className="g2g-login-card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '500px' }}>
            <span className="modal-close" onClick={() => setActiveModal(null)} style={{ color: '#9ea2a9', float: 'right', cursor: 'pointer', fontSize: '20px' }}>×</span>
            <h3 className="g2g-login-title" style={{ textAlign: 'left', marginBottom: '16px' }}>Đăng Ký Người Bán Game</h3>
            <p style={{ fontSize: '13px', color: '#9ea2a9', marginBottom: '24px', lineHeight: 1.5 }}>
              Kiếm thêm thu nhập từ việc bán xu game, tài khoản dư hoặc cày thuê game. Quá trình xét duyệt miễn phí và nhanh chóng!
            </p>
            <form onSubmit={handleSellerSubmit}>
              <div className="g2g-login-form-group">
                <label className="g2g-login-label">Trò chơi muốn giao dịch chính</label>
                <div className="g2g-login-input-wrapper">
                  <select 
                    className="g2g-login-input"
                    value={sellerGame}
                    onChange={(e) => setSellerGame(e.target.value)}
                    style={{ appearance: 'none', cursor: 'pointer' }}
                  >
                    <option value="Valorant">Valorant</option>
                    <option value="Roblox">Roblox</option>
                    <option value="League of Legends">League of Legends</option>
                    <option value="Genshin Impact">Genshin Impact</option>
                  </select>
                </div>
              </div>
              
              <div className="g2g-login-form-group">
                <label className="g2g-login-label">Mô tả ngắn kinh nghiệm &amp; sản phẩm bán</label>
                <div className="g2g-login-input-wrapper">
                  <textarea 
                    className="g2g-login-input"
                    rows="3" 
                    placeholder="Ví dụ: Tôi có nguồn Robux sạch dồi dào, hoặc có đội cày thuê Liên Quân uy tín..."
                    value={sellerExperience}
                    onChange={(e) => setSellerExperience(e.target.value)}
                    style={{ resize: 'vertical', minHeight: '80px' }}
                    required
                  ></textarea>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', alignItems: 'flex-start' }}>
                <input type="checkbox" id="sellerAgree" required style={{ marginTop: '3px', accentColor: '#ff3333' }} />
                <label htmlFor="sellerAgree" style={{ fontSize: '12px', color: '#9ea2a9', lineHeight: 1.4, cursor: 'pointer' }}>
                  Tôi cam kết cung cấp sản phẩm sạch và tuân thủ quy định giao dịch của G2G.
                </label>
              </div>

              <button type="submit" className="g2g-login-btn-submit" style={{ width: '100%' }}>
                Gửi Hồ Sơ Xét Duyệt
              </button>
            </form>
          </div>
        </div>
      )}

      {/* GamerProtect Modal */}
      {activeModal === 'gamerprotect' && (
        <div className="modal-overlay" onClick={() => setActiveModal(null)} style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(6px)', zIndex: 1000 }}>
          <div className="g2g-login-card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '600px', padding: '32px' }}>
            <span className="modal-close" onClick={() => setActiveModal(null)} style={{ color: '#9ea2a9', float: 'right', cursor: 'pointer', fontSize: '24px' }}>×</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
              <span style={{ fontSize: '32px' }}>🛡️</span>
              <div>
                <h3 className="g2g-login-title" style={{ textAlign: 'left', marginBottom: '4px', fontSize: '20px' }}>Bảo Vệ Giao Dịch GamerProtect</h3>
                <p style={{ fontSize: '12px', color: '#9ea2a9', margin: 0 }}>Giao dịch an toàn, không lo lừa đảo cùng G2G</p>
              </div>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '28px', maxHeight: '400px', overflowY: 'auto', paddingRight: '8px' }}>
              <div style={{ display: 'flex', gap: '16px', background: 'rgba(255,255,255,0.03)', padding: '16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                <span style={{ fontSize: '24px', marginTop: '2px' }}>🔒</span>
                <div>
                  <h4 style={{ margin: '0 0 6px 0', color: '#fff', fontSize: '14px', fontWeight: 600 }}>Ký quỹ bảo đảm (Escrow System)</h4>
                  <p style={{ margin: 0, fontSize: '13px', color: '#9ea2a9', lineHeight: 1.5 }}>
                    Khi bạn thanh toán đơn hàng, tiền sẽ được G2G giữ tạm thời trên hệ thống. Người bán chỉ được nhận thanh toán khi bạn đã xác nhận nhận hàng đầy đủ và hài lòng với dịch vụ.
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '16px', background: 'rgba(255,255,255,0.03)', padding: '16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                <span style={{ fontSize: '24px', marginTop: '2px' }}>⚖️</span>
                <div>
                  <h4 style={{ margin: '0 0 6px 0', color: '#fff', fontSize: '14px', fontWeight: 600 }}>Giải quyết tranh chấp công bằng (24/7 Support)</h4>
                  <p style={{ margin: 0, fontSize: '13px', color: '#9ea2a9', lineHeight: 1.5 }}>
                    Đội ngũ hỗ trợ chuyên nghiệp của G2G túc trực 24/7 để phân xử các trường hợp tranh chấp. Bạn chỉ cần cung cấp hình ảnh hoặc video bằng chứng giao dịch, chúng tôi sẽ xử lý công bằng.
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '16px', background: 'rgba(255,255,255,0.03)', padding: '16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                <span style={{ fontSize: '24px', marginTop: '2px' }}>👤</span>
                <div>
                  <h4 style={{ margin: '0 0 6px 0', color: '#fff', fontSize: '14px', fontWeight: 600 }}>Xác minh người bán nghiêm ngặt</h4>
                  <p style={{ margin: 0, fontSize: '13px', color: '#9ea2a9', lineHeight: 1.5 }}>
                    Tất cả người bán chuyên nghiệp trên G2G đều bắt buộc phải trải qua quy trình xác minh danh tính eKYC nghiêm ngặt và ký quỹ tài chính để phòng ngừa rủi ro.
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '16px', background: 'rgba(255,255,255,0.03)', padding: '16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                <span style={{ fontSize: '24px', marginTop: '2px' }}>💸</span>
                <div>
                  <h4 style={{ margin: '0 0 6px 0', color: '#fff', fontSize: '14px', fontWeight: 600 }}>Cam kết hoàn trả 100%</h4>
                  <p style={{ margin: 0, fontSize: '13px', color: '#9ea2a9', lineHeight: 1.5 }}>
                    Nếu phát hiện sản phẩm bị lỗi, sai mô tả hoặc bị thu hồi từ phía người bán, G2G cam kết hoàn tiền 100% trực tiếp vào ví của bạn hoặc hoàn về phương thức thanh toán gốc.
                  </p>
                </div>
              </div>
            </div>

            <button 
              className="g2g-login-btn-submit" 
              style={{ width: '100%', borderRadius: '8px', padding: '12px' }}
              onClick={() => setActiveModal(null)}
            >
              Đồng ý &amp; Đóng
            </button>
          </div>
        </div>
      )}

      {/* Payment Methods Modal */}
      {activeModal === 'payment_methods' && (() => {
        const ALL_PAYMENTS = [
          { name: 'Visa', category: 'cards', icon: '💳' },
          { name: 'MasterCard', category: 'cards', icon: '💳' },
          { name: 'JCB', category: 'cards', icon: '💳' },
          { name: 'American Express', category: 'cards', icon: '💳' },
          { name: 'UnionPay', category: 'cards', icon: '💳' },
          { name: 'PayPal', category: 'wallets', icon: '🦊' },
          { name: 'Skrill', category: 'wallets', icon: '💜' },
          { name: 'Neteller', category: 'wallets', icon: '💚' },
          { name: 'WebMoney', category: 'wallets', icon: '🌐' },
          { name: 'Alipay', category: 'wallets', icon: '💙' },
          { name: 'WeChat Pay', category: 'wallets', icon: '💚' },
          { name: 'CVS (7-Eleven)', category: 'cash', icon: '🏪' },
          { name: 'Dollar General', category: 'cash', icon: '💵' },
          { name: 'Chuyển khoản Ngân hàng', category: 'cash', icon: '🏦' },
          { name: 'Western Union', category: 'cash', icon: '💛' },
          { name: 'Bitcoin (BTC)', category: 'crypto', icon: '🪙' },
          { name: 'Tether (USDT)', category: 'crypto', icon: '💵' },
          { name: 'Ethereum (ETH)', category: 'crypto', icon: '🔷' },
          { name: 'Garena Shells Card', category: 'crypto', icon: '🏷️' },
          { name: 'Steam Wallet Card', category: 'crypto', icon: '🕹️' }
        ];

        const filteredPayments = ALL_PAYMENTS.filter(pay => 
          pay.name.toLowerCase().includes(paymentSearch.toLowerCase())
        );

        return (
          <div className="modal-overlay" onClick={() => { setActiveModal(null); setPaymentSearch(''); }} style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(6px)', zIndex: 1000 }}>
            <div className="g2g-login-card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '650px', padding: '32px' }}>
              <span className="modal-close" onClick={() => { setActiveModal(null); setPaymentSearch(''); }} style={{ color: '#9ea2a9', float: 'right', cursor: 'pointer', fontSize: '24px' }}>×</span>
              <h3 className="g2g-login-title" style={{ textAlign: 'left', marginBottom: '8px', fontSize: '20px' }}>Hỗ Trợ +200 Phương Thức Thanh Toán</h3>
              <p style={{ fontSize: '13px', color: '#9ea2a9', marginBottom: '20px', lineHeight: 1.5 }}>
                G2G hỗ trợ đa dạng hình thức thanh toán toàn cầu và nội địa giúp bạn nạp tiền và mua hàng dễ dàng, an toàn nhất.
              </p>

              {/* Search input */}
              <div className="g2g-login-form-group" style={{ marginBottom: '20px' }}>
                <div className="g2g-login-input-wrapper">
                  <input 
                    type="text" 
                    className="g2g-login-input" 
                    placeholder="🔍 Tìm kiếm phương thức thanh toán..." 
                    value={paymentSearch}
                    onChange={(e) => setPaymentSearch(e.target.value)}
                    style={{ paddingLeft: '12px' }}
                  />
                </div>
              </div>

              {/* Payment grids by categories */}
              <div style={{ maxHeight: '350px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '20px', paddingRight: '8px' }}>
                {['cards', 'wallets', 'cash', 'crypto'].map((cat) => {
                  const itemsInCat = filteredPayments.filter(p => p.category === cat);
                  if (itemsInCat.length === 0) return null;

                  const catName = 
                    cat === 'cards' ? 'Thẻ Tín Dụng & Ghi Nợ' :
                    cat === 'wallets' ? 'Ví Điện Tử' :
                    cat === 'cash' ? 'Ngân Hàng & Điểm Thu Hộ' : 'Tiền Điện Tử & Thẻ Cào';

                  return (
                    <div key={cat}>
                      <h4 style={{ color: '#fff', fontSize: '13px', fontWeight: 600, margin: '0 0 10px 0', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '4px' }}>
                        {catName}
                      </h4>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '8px' }}>
                        {itemsInCat.map((pay) => (
                          <div 
                            key={pay.name} 
                            style={{ 
                              background: 'rgba(255,255,255,0.03)', 
                              border: '1px solid rgba(255,255,255,0.05)', 
                              padding: '12px', 
                              borderRadius: '8px', 
                              display: 'flex', 
                              flexDirection: 'column', 
                              alignItems: 'center', 
                              gap: '6px',
                              textAlign: 'center',
                              transition: 'all 0.2s'
                            }}
                          >
                            <span style={{ fontSize: '20px' }}>{pay.icon}</span>
                            <span style={{ fontSize: '12px', color: '#dfdfdf', fontWeight: 500 }}>{pay.name}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}

                {filteredPayments.length === 0 && (
                  <div style={{ textAlign: 'center', padding: '40px 0', color: '#9ea2a9', fontSize: '13px' }}>
                    Không tìm thấy phương thức thanh toán phù hợp.
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })()}
    </>
  );
}
