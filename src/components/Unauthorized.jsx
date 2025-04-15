import React from 'react';
import { Button, Result } from 'antd';
import { useNavigate } from 'react-router-dom';

const Unauthorized = () => {
  const navigate = useNavigate();

  const goBack = () => {
    navigate(-1); // Quay lại trang trước trong lịch sử duyệt web
  };

  const goHome = () => {
    navigate('/'); // Chuyển về trang chủ
  };

  return (
    <Result
      status="403"
      title="403"
      subTitle="Sorry, you are not authorized to access this page."
      extra={[
        <Button key="back" onClick={goBack}>
          Quay lại
        </Button>,
        <Button key="home" type="primary" onClick={goHome}>
          Về trang chủ
        </Button>,
      ]}
    />
  );
};

export default Unauthorized;