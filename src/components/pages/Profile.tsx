import "react-image-crop/dist/ReactCrop.css";

import React, { useState } from "react";
import ReactCrop from "react-image-crop";
import styled from "styled-components";
import PrimaryButton from "../atoms/PrimaryButton";
import sampleProfileJpg from "../../assets/images/sample_profile.jpg";

const Profile: React.FC = () => {
  const [crop, setCrop] = useState<ReactCrop.Crop>({ x: 20, y: 10, width: 30, height: 10 });

  const onChange = (newCrop: ReactCrop.Crop) => {
    setCrop(newCrop);
  };

  return (
    <Wrapper>
      <ReactCrop src={sampleProfileJpg} onChange={onChange} crop={crop} style={{ maxHeight: "500px" }} />
      <Buttons>
        <PrimaryButton text="Update" />
        <PrimaryButton text="Cancel" />
      </Buttons>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  width: 300px;
  margin: 0 auto;
  text-align: center;
`;

const Buttons = styled.div`
  display: flex;
  justify-content: space-between;
  width: 244px;
  margin: 26px auto;

  button {
    width: 100px;
  }
`;

export default Profile;
