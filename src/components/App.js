import React, { Component } from 'react';
import De1 from './de1';
import De2 from './de2'; // Component cho /de2

class App extends Component {
  state = {
    path: window.location.pathname || '/de1', // lưu path trong state
  };

  componentDidMount() {
    // Nếu path rỗng, cập nhật state và URL
    if (this.state.path === '/' || this.state.path === '') {
      this.setState({ path: '/de1' });
      window.history.replaceState(null, '', '/de1');
    }

    // Lắng nghe thay đổi URL (nếu người dùng back/forward)
    window.addEventListener('popstate', this.handlePopState);
  }

  componentWillUnmount() {
    window.removeEventListener('popstate', this.handlePopState);
  }

  handlePopState = () => {
    this.setState({ path: window.location.pathname });
  };

  render() {
    const { path } = this.state;

    let content;
    if (path === '/de1') {
      content = <De1 />;
    } else if (path === '/de2') {
      content = <De2 />;
    } else {
      content = <div>Không tìm thấy trang</div>;
    }

    return <div>{content}</div>;
  }
}

export default App;
