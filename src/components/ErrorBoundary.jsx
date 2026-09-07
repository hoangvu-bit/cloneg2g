import React from 'react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    if (this.props.onReset) {
      this.props.onReset();
    } else {
      window.location.reload();
    }
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '60vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '40px 20px',
          textAlign: 'center',
          color: '#ffffff',
          fontFamily: "'Outfit', 'Inter', sans-serif"
        }}>
          <div style={{
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: '16px',
            padding: '36px 32px',
            maxWidth: '520px',
            width: '100%',
            boxShadow: '0 20px 40px rgba(0,0,0,0.5)'
          }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>⚠️</div>
            <h3 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '10px', color: '#f87171' }}>
              Đã xảy ra sự cố khi hiển thị giao diện
            </h3>
            <p style={{ fontSize: '14px', color: '#9ea2a9', lineHeight: 1.6, marginBottom: '24px' }}>
              Đừng lo! Dữ liệu giao dịch và số dư ví của bạn đã được lưu an toàn. Bạn có thể nhấn nút bên dưới để tải lại dữ liệu.
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button
                onClick={this.handleReset}
                style={{
                  background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '10px 20px',
                  fontWeight: 600,
                  fontSize: '14px',
                  cursor: 'pointer',
                  boxShadow: '0 4px 14px rgba(239, 68, 68, 0.4)'
                }}
              >
                🔄 Tải lại trang
              </button>
              <button
                onClick={() => {
                  this.setState({ hasError: false, error: null });
                  if (window.history && window.history.pushState) {
                    window.history.pushState({}, '', '/');
                  }
                  window.location.reload();
                }}
                style={{
                  background: 'transparent',
                  color: '#9ea2a9',
                  border: '1px solid #374151',
                  borderRadius: '8px',
                  padding: '10px 20px',
                  fontWeight: 600,
                  fontSize: '14px',
                  cursor: 'pointer'
                }}
              >
                🏠 Về Trang Chủ
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
