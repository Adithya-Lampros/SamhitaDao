import React, { useEffect, useState } from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import ConnectButtonCustom from "./ConnectButtonCustom";
import logo from "../assets/LOGO1.png";
import { Link } from "react-router-dom";
import { useAccount, useSigner } from "wagmi";
import * as PushAPI from "@pushprotocol/restapi";
import { Modal } from "@mui/material";
import manualImage from "../../src/assets/navbar/manual-book.png"

function Navbar() {
  const { address, isConnected } = useAccount();
  const { data: signer } = useSigner();

  // notifiaction model code *******************************
  const [open, setOpen] = useState(false);
  const [showOpted, setOpted] = useState(false);
  const [showPushNotifications, setPushNotifications] = useState([]);

  const handleOpen = () => {
    setOpen(true);
    // notifi();
  };
  const handleClose = () => {
    setOpen(false);
  };

  const optIn = async () => {
    await PushAPI.channels.subscribe({
      signer: signer,
      channelAddress: "eip155:3141:0x158a6720c0709F8B55dc9753B92DF1d555A9F577", // channel address in CAIP
      userAddress: `eip155:3141:${address}`, // user address in CAIP
      onSuccess: () => {
        console.log("opt in success");
      },
      onError: () => {
        console.error("opt in error");
      },
      env: "staging",
    });
  };

  const optOut = async () => {
    await PushAPI.channels.unsubscribe({
      signer: signer,
      channelAddress: "eip155:5:0x158a6720c0709F8B55dc9753B92DF1d555A9F577", // channel address in CAIP
      userAddress: "eip155:5:0xeB88DDaEdA2261298F1b740137B2ae35aA42A975", // user address in CAIP
      onSuccess: () => {
        console.log("opt out success");
      },
      onError: () => {
        console.error("opt out error");
      },
      env: "staging",
    });
  };
  useEffect(() => {
    if (address) {
      const subscriptions = PushAPI.user.getSubscriptions({
        user: `eip155:5:${address}`, // user address in CAIP
        env: "staging",
      });
      if (subscriptions.length === 0) {
        setOpted(false);
      }
      for (let i = 0; i < subscriptions.length; i++) {
        if (
          subscriptions[i].channel ===
          "0x158a6720c0709F8B55dc9753B92DF1d555A9F577"
        ) {
          console.log("subscribed");
          setOpted(true);
        }
      }
      console.log(subscriptions);
    }
  }, [address]);

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "50vw",
    bgcolor: "background.paper",
    borderRadius: "20px",
    boxShadow: 24,
    p: 0,
    paddingBottom: "32px",
    maxHeight: "70vh",
    overflow: "auto",
    overflowX: "hidden",
    maxWidth: "700px",
  };

  return (
    <AppBar
      position="static"
      sx={{
        backgroundColor: "transparent",
        padding: "10px 10px 10px 15px",
        position: "relative",
        zIndex: "50",
        boxShadow: "none",
      }}
    >
      <Container maxWidth="100%">
        <Toolbar disableGutters>
          <div className="logo-div">
            <Link to="/">
              <img src={logo} alt="logo" className="logo" />
            </Link>
          </div>

          <div className="conncet-btn-div"> 
          <div className="me-3 p-2 " style={{backgroundColor:"#fff", borderRadius:"50%"}}> <a href="https://samhitadao.gitbook.io/samhita-dao-2/" target="_blank"> <img src={manualImage} alt="Manual logo" height={"40px"}/>  </a></div>
            {isConnected ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="36px"
                viewBox="0 0 24 24"
                width="36px"
                fill="#FFFFFF"
                onClick={handleOpen}
              >
                <path d="M0 0h24v24H0V0z" fill="none" />
                {/* <path d="M18 16v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.68-1.5-1.51-1.5S10.5 3.17 10.5 4v.68C7.63 5.36 6 7.92 6 11v5l-1.3 1.29c-.63.63-.19 1.71.7 1.71h13.17c.89 0 1.34-1.08.71-1.71L18 16zm-6.01 6c1.1 0 2-.9 2-2h-4c0 1.1.89 2 2 2zM6.77 4.73c.42-.38.43-1.03.03-1.43-.38-.38-1-.39-1.39-.02C3.7 4.84 2.52 6.96 2.14 9.34c-.09.61.38 1.16 1 1.16.48 0 .9-.35.98-.83.3-1.94 1.26-3.67 2.65-4.94zM18.6 3.28c-.4-.37-1.02-.36-1.4.02-.4.4-.38 1.04.03 1.42 1.38 1.27 2.35 3 2.65 4.94.07.48.49.83.98.83.61 0 1.09-.55.99-1.16-.38-2.37-1.55-4.48-3.25-6.05z" /> */}
              </svg>
            ) : (
              ""
            )}
            <ConnectButtonCustom />
          </div>
        </Toolbar>
      </Container>

      {/******************** push notification popup *******************/}
      {/* <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style} className="push-box">
          <Typography
            id="modal-modal-title"
            variant="h6"
            component="h2"
            style={{
              position: "sticky",
              top: "0",
              backgroundColor: "#4c2ffd",
              color: "#fefcfc",
              padding: "20px 20px",
              margin: "0px",
              fontWeight: 600,
            }}
          >
            Notifications
            {showOpted === true ? (
              <button onClick={() => optOut()} className="push-btns">
                Opt Out
              </button>
            ) : showOpted === false ? (
              <button onClick={() => optIn()} className="push-btns">
                Opt IN
              </button>
            ) : (
              ""
            )}
          </Typography>{" "}
          <Typography id="modal-modal-description" sx={{ mt: 2, p: 2 }}>
            {showPushNotifications.length > 0 &&
              showOpted === true &&
              showPushNotifications.map((item, key) => {
                return (
                  <div
                    style={{
                      border: "1px solid #10bb35aa",
                      margin: "10px 0px",
                      padding: "10px",
                      borderRadius: "10px",
                    }}
                  >
                    <h4 key={key}>{item.title} </h4>
                    <p>{item.message}</p>
                  </div>
                );
              })}
            {!showOpted ? (
              <div
                style={{
                  border: "1px solid #4c2ffd",
                  margin: "10px 0px",
                  padding: "10px",
                  borderRadius: "10px",
                }}
              >
                <h4>Opt In Money-Router channel to get notification </h4>
                <p>
                  Channel address - 0x158a6720c0709F8B55dc9753B92DF1d555A9F577{" "}
                </p>
              </div>
            ) : null}
          </Typography>
        </Box>
      </Modal> */}
    </AppBar>
  );
}

export default Navbar;
