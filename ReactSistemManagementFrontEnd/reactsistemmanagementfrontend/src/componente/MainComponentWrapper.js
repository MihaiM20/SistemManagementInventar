import React from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import MainComponent from "./MainComponent";

/**
 * MainComponentWrapper este un wrapper functional care injectează
 * hook-urile de routing (navigate, params, location) în componenta de clasă MainComponent.
 * Astfel, MainComponent poate folosi aceste funcționalități fără să fie convertită într-o componentă cu hook-uri.
 */
function MainComponentWrapper(props) {
  // Hook pentru navigație programatică (ex: navigate('/acasa'))
  const navigate = useNavigate();
  // Hook pentru extragerea parametrilor din URL (ex: params.id)
  const params = useParams();
  // Hook pentru acces la locația curentă (pathname, search etc.)
  const location = useLocation();

  return (
    <MainComponent
      {...props}        // Toate props-urile inițiale (page, activepage etc.)
      navigate={navigate}
      params={params}
      location={location}
    />
  );
}

export default MainComponentWrapper;
