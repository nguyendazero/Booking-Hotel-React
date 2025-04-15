// CheckinPage.js
import React, { useEffect, useState } from "react";
import Statistic from "../components/Statistic";
import { useSelector } from "react-redux";

function CheckinPage() {
  const token = useSelector((state) => state.auth.token);
 
  return (
    <>
      <Statistic />
    </>
  );
}

export default CheckinPage;