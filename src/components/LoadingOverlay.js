import React from "react";
const TIME_RUN = 500;
class LoadingOverlay extends React.Component {
  state = {
    show: false,
  };

  timeoutId = null;

  static getDerivedStateFromProps(nextProps, prevState) {
    // Nếu loading bật thì show ngay
    if (nextProps.loading && !prevState.show) {
      return { show: true };
    }
    // Nếu loading tắt thì giữ show = true, chờ 1s
    if (!nextProps.loading && prevState.show) {
      return null;
    }
    return null;
  }

  componentDidUpdate(prevProps) {
    if (!this.props.loading && prevProps.loading) {
      // khi loading từ true -> false, delay 1s trước khi hide
      this.timeoutId = setTimeout(() => {
        this.setState({ show: false });
      }, TIME_RUN);
    }
    if (this.props.loading && !prevProps.loading) {
      // nếu loading bật lại, cancel timeout cũ
      clearTimeout(this.timeoutId);
    }
  }

  componentWillUnmount() {
    clearTimeout(this.timeoutId);
  }

  render() {
    if (!this.state.show) return null;

    return (
      <div style={styles.overlay}>
        <div style={styles.spinner}></div>
      </div>
    );
  }
}

const styles = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    backgroundColor: "rgba(0,0,0,0.3)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 9999,
  },
  spinner: {
    width: "60px",
    height: "60px",
    border: "6px solid #ccc",
    borderTop: "6px solid #3498db",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
  },
};

// keyframes
const styleSheet = document.styleSheets[0];
styleSheet.insertRule(`
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
`, styleSheet.cssRules.length);

export default LoadingOverlay;
