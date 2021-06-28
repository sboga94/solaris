import React from 'react';
import "../../layout/theme/scss/main.scss";
import logo from "../../layout/theme/images/logo.svg";

const Header = (props) => {
    
    return (
        <React.Fragment>
            <div className="header">
                <div className="title">
                    <div>{props.title}</div>
                </div>
                <img src={logo} />
            </div>

        </React.Fragment>
    );
};

export default Header;
