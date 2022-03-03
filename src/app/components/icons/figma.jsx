import React from 'react'


export const Base = ({ strokeWidth, className }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 16 16"
      className={className}
      stroke="currentColor"
    >
      <path
        strokeWidth={strokeWidth}
        fillRule="evenodd"
        clipRule="evenodd"
        d="M11 4H5C4.44772 4 4 4.44772 4 5V11C4 11.5523 4.44772 12 5 12H11C11.5523 12 12 11.5523 12 11V5C12 4.44772 11.5523 4 11 4ZM5 3C3.89543 3 3 3.89543 3 5V11C3 12.1046 3.89543 13 5 13H11C12.1046 13 13 12.1046 13 11V5C13 3.89543 12.1046 3 11 3H5Z"
        fill="#000"
      />
    </svg>
  )
}

export const Blend = ({ strokeWidth, className }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 9 11"
      className={className}
      stroke="currentColor"
    >
      <path
        strokeWidth={strokeWidth}
        fillRule="evenodd"
        clipRule="evenodd"
        d="M4.69485 0.720051C4.47476 0.491086 4.24369 0.252036 4.00162 0.00161947C4.0011 0.0010797 4.00057 0.000539877 4.00005 0L3.99961 0.000456353C3.99926 0.000814133 3.99892 0.00117189 3.99857 0.00152962C3.75647 0.251979 3.52537 0.491058 3.30526 0.720049C1.10181 3.01238 1.19112e-05 4.29386 1.20429e-05 5.85188C-0.00250045 6.91425 0.38812 7.97747 1.17166 8.78804C2.73374 10.404 5.26637 10.404 6.82844 8.78804C7.61199 7.97747 8.0025 6.91429 7.99999 5.85191C7.99999 4.29389 6.89828 3.01238 4.69485 0.720051ZM4.00005 1.4404C3.02355 2.457 2.30665 3.23086 1.80482 3.91125C1.20502 4.72447 1.00001 5.2912 1.00001 5.85188V5.85424C0.998075 6.67196 1.29843 7.48037 1.89065 8.09302C3.05965 9.30233 4.94046 9.30233 6.10945 8.09302C6.70163 7.48041 7.00192 6.67205 6.99999 5.85428L6.99999 5.85191C6.99999 5.29121 6.79498 4.72446 6.19521 3.91125C5.69341 3.23086 4.97654 2.45699 4.00005 1.4404Z"
        fill="#000"
      />
    </svg>
  )
}

export const Corners = ({ strokeWidth, className }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 9 9"
      className={`p-1 w-4 h-4 mr-2`}
      stroke="currentColor"
    >
      <path
        strokeWidth={strokeWidth}
        fillRule="evenodd"
        clipRule="evenodd"
        d="M9 1H5C2.79086 1 1 2.79086 1 5V9H0V5C0 2.23858 2.23858 0 5 0H9V1Z"
        fill="#000"
      />
    </svg>
  )
}

export const Star = ({ strokeWidth, className }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 16 16"
      className={`${className}`}
      stroke="currentColor"
    >
      <path
        strokeWidth={strokeWidth}
        fillRule="evenodd"
        clipRule="evenodd"
        d="M8 1.61803L9.32058 5.68237L9.43284 6.02786H9.79611H14.0696L10.6123 8.53976L10.3184 8.75329L10.4306 9.09878L11.7512 13.1631L8.29389 10.6512L8 10.4377L7.70611 10.6512L4.24877 13.1631L5.56936 9.09878L5.68162 8.75329L5.38772 8.53976L1.93039 6.02786H6.20389H6.56716L6.67942 5.68237L8 1.61803Z"
        fill="#000"
      />
    </svg>
  )
}

export const Rectangle = ({ strokeWidth, className }) => {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      viewBox="0 0 18 18"
    >
      <path
        d="M16 2v14H2V2h14zm0 15h1V1H1v16h15z"
        fillRule="nonzero"
        fillOpacity="1"
        fill="#000"
        stroke="none"
      />
    </svg>
  )
}

export const Layout = ({ strokeWidth, className }) => {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 16 16"
    >
      <path
        d="M3 3v1h6V3H3zm0 2.5v1h8v-1H3zM3 8v1h4V8H3z"
        fillRule="nonzero"
        fillOpacity=".8"
        fill="#000"
        stroke="none"
      />
      <path
        d="M14 1H2c-.552 0-1 .448-1 1v12c0 .552.448 1 1 1h12c.552 0 1-.448 1-1V2c0-.552-.448-1-1-1zM2 0C.895 0 0 .895 0 2v12c0 1.105.895 2 2 2h12c1.105 0 2-.895 2-2V2c0-1.105-.895-2-2-2H2z"
        fillRule="evenodd"
        fillOpacity=".8"
        fill="#000"
        stroke="none"
      />
    </svg>
  )
}

export const Circle = ({ strokeWidth, className }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 16 16"
      className={className}
      stroke="currentColor"
    >
      <path
        strokeWidth={strokeWidth}
        fillRule="evenodd"
        clipRule="evenodd"
        d="M4 8C4 10.2091 5.79086 12 8 12C10.2091 12 12 10.2091 12 8C12 5.79086 10.2091 4 8 4C5.79086 4 4 5.79086 4 8ZM8 3C5.23858 3 3 5.23858 3 8C3 10.7614 5.23858 13 8 13C10.7614 13 13 10.7614 13 8C13 5.23858 10.7614 3 8 3Z"
        fill="#000"
      />
    </svg>
  )
}

export const Group = ({ strokeWidth, className }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      width="16"
      height="16"
      viewBox="0 0 16 16"
      className={className}
      stroke="currentColor"
    >
      <path
        strokeWidth={strokeWidth}
        fillRule="evenodd"
        clipRule="evenodd"
        d="M9 3H7V4H9V3ZM11.5 12H12V11.5H13V12V13H12H11.5V12ZM4 7V9H3V7H4ZM12 4.5V4H11.5V3H12H13V4V4.5H12ZM12 7V9H13V7H12ZM4 4.5V4H4.5V3H4H3V4V4.5H4ZM3 12V11.5H4V12H4.5V13H4H3V12ZM9 12H7V13H9V12Z"
        fill="#000"
      />
    </svg>
  )
}

export const Text = ({ strokeWidth, className }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 16 16"
      className={className}
      stroke="currentColor"
    >
      <path
        strokeWidth={strokeWidth}
        fillRule="evenodd"
        clipRule="evenodd"
        d="M3 3H3.5H8H12.5H13V3.5V6H12V4H8.5V12H10V13H8H6V12H7.5V4H4V6H3V3.5V3Z"
        fill="#000"
      />
    </svg>
  )
}

/*
export const Frame = ({ strokeWidth, className }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 16 16"
      className={className}
      stroke="currentColor"
    >
      <path
        strokeWidth={strokeWidth}
        fillRule="evenodd"
        clipRule="evenodd"
        d="M6 2.5V3V5H10V3V2.5H11V3V5H13H13.5V6H13H11L11 10H13H13.5V11H13H11V13V13.5H10V13V11H6V13V13.5H5V13V11H3H2.5V10H3H5L5 6H3H2.5V5H3H5V3V2.5H6ZM10 10V6H6L6 10H10Z"
        fill="#000"
      />
    </svg>
  )
}
*/


export const Frame = ({ strokeWidth, className }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      width="18"
      height="18"
      viewBox="0 0 18 18"
    >
      <path
        strokeWidth={strokeWidth}
        d="M3 16v-3H0v-1h3V4H0V3h3V0h1v3h8V0h1v3h3v1h-3v8h3v1h-3v3h-1v-3H4v3H3zm9-4V4H4v8h8z"
        fillRule="evenodd"
        fillOpacity="1"
        fill="#000"
        stroke="none"
      />
    </svg>
  )
}

export const Selection = ({ strokeWidth, className }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      width="12"
      height="14"
      viewBox="0 0 20 16"
    >
      <path
        d="M2.5 5C3.88 5 5 3.88 5 2.5 5 1.12 3.88 0 2.5 0 1.12 0 0 1.12 0 2.5 0 3.88 1.12 5 2.5 5zm0-1C1.672 4 1 3.328 1 2.5 1 1.672 1.672 1 2.5 1 3.328 1 4 1.672 4 2.5 4 3.328 3.328 4 2.5 4zm11 1C14.88 5 16 3.88 16 2.5 16 1.12 14.88 0 13.5 0 12.12 0 11 1.12 11 2.5 11 3.88 12.12 5 13.5 5zm0-1c-.828 0-1.5-.672-1.5-1.5 0-.828.672-1.5 1.5-1.5.828 0 1.5.672 1.5 1.5 0 .828-.672 1.5-1.5 1.5zm0 12c1.38 0 2.5-1.12 2.5-2.5 0-1.38-1.12-2.5-2.5-2.5-1.38 0-2.5 1.12-2.5 2.5 0 1.38 1.12 2.5 2.5 2.5zm0-1c-.828 0-1.5-.672-1.5-1.5 0-.828.672-1.5 1.5-1.5.828 0 1.5.672 1.5 1.5 0 .828-.672 1.5-1.5 1.5zm-11 1C3.88 16 5 14.88 5 13.5 5 12.12 3.88 11 2.5 11 1.12 11 0 12.12 0 13.5 0 14.88 1.12 16 2.5 16zm0-1c-.828 0-1.5-.672-1.5-1.5 0-.828.672-1.5 1.5-1.5.828 0 1.5.672 1.5 1.5 0 .828-.672 1.5-1.5 1.5zm8.55-12.996h-6.1c.033.16.05.326.05.496 0 .17-.017.336-.05.496h6.1c-.033-.16-.05-.326-.05-.496 0-.17.017-.336.05-.496zM14 11.05l.003-6.1c-.162.033-.33.05-.503.05-.172 0-.34-.017-.503-.05l.003 6.1c.162-.033.329-.05.5-.05.171 0 .338.017.5.05zM4.95 14h6.1c-.033-.162-.05-.329-.05-.5 0-.171.017-.338.05-.5h-6.1c.033.162.05.329.05.5 0 .171-.017.338-.05.5zM2 4.95l-.003 6.1c.162-.033.33-.05.503-.05.172 0 .34.017.503.05l-.002-6.1c-.162.033-.33.05-.501.05-.172 0-.34-.017-.5-.05z"
        fillRule="nonzero"
        fillOpacity="1"
        fill="#000"
        stroke="none"
      />
    </svg>
  )
}

export const Mask = ({ strokeWidth, className }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      width="18"
      height="18"
      viewBox="0 0 18 18"
    >
      <path
        d="M5.5 16.196C6.557 16.71 7.745 17 9 17c4.418 0 8-3.582 8-8 0-4.418-3.582-8-8-8-1.255 0-2.443.29-3.5.804C2.836 3.103 1 5.837 1 9c0 3.163 1.836 5.898 4.5 7.196zM16 9c0 3.866-3.134 7-7 7-.854 0-1.673-.153-2.43-.433C8.643 14.12 10 11.719 10 9c0-2.719-1.357-5.121-3.43-6.567C7.327 2.153 8.146 2 9 2c3.866 0 7 3.134 7 7z"
        fillRule="nonzero"
        fillOpacity="1"
        fill="#000"
        stroke="none"
      />
    </svg>
  )
}

export const Padding = ({ strokeWidth, className }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      width="12"
      height="12"
      viewBox="0 0 12 12"
    >
      <path
        d="M3 3h6v6H3V3zm1 1h4v4H4V4zM0 0h12v12H0V0zm1 1h10v10H1V1z"
        fillRule="evenodd"
        fillOpacity="1"
        fill="#000"
        stroke="none"
      />
    </svg>
  )
}

export const Spacing = ({ strokeWidth, className }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      width="12"
      height="13"
      viewBox="0 0 12 13"
    >
      <path
        d="M11 13v-2H1v2H0v-3h12v3h-1zm1-10H0V0h1v2h10V0h1v3zM9 7V6H3v1h6z"
        fillRule="nonzero"
        fillOpacity="1"
        fill="#000"
        stroke="none"
      />
    </svg>
  )
}

export const Component = ({ strokeWidth, className }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      width="18"
      height="18"
      viewBox="0 0 18 18"
    >
      <path
        d="M5.063 3.938l.707.707 2.523 2.523.707.707.707-.707 2.523-2.523.707-.707-.707-.708L9.707.707 9 0l-.707.707L5.77 3.23l-.707.708zm6.46 0L9 6.46 6.477 3.937 9 1.414l2.523 2.524zm-6.46 10.124l.707.708 2.523 2.523L9 18l.707-.707 2.523-2.523.707-.707-.707-.708-2.523-2.523L9 10.125l-.707.707-2.523 2.523-.707.707zm6.46 0L9 16.587l-2.523-2.523L9 11.538l2.523 2.524zM.707 9.707L0 9l.707-.707L3.23 5.77l.708-.707.707.707 2.523 2.523.707.707-.707.707-2.523 2.523-.707.707-.708-.707L.707 9.707zm3.23 1.816L6.462 9 3.937 6.477 1.414 9l2.524 2.523zM10.125 9l.707.707 2.523 2.523.707.707.708-.707 2.523-2.523L18 9l-.707-.707L14.77 5.77l-.707-.707-.708.707-2.523 2.523-.707.707zm6.46 0l-2.523 2.523L11.54 9l2.524-2.523L16.585 9z"
        fillRule="evenodd"
        fillOpacity="1"
        fill="#000"
        stroke="none"
      />
    </svg>
  )
}

export const Drop = ({ strokeWidth, className }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      width="8"
      height="10"
      viewBox="0 0 8 10"
    >
      <path
        d="M4 0L1.17 2.925C.39 3.733 0 4.81 0 5.845c0 1.036.39 2.129 1.17 2.936.78.808 1.805 1.217 2.83 1.217 1.025 0 2.05-.409 2.83-1.217C7.61 7.974 8 6.881 8 5.846c0-1.036-.39-2.113-1.17-2.92L4 0zm0 1.438L6.11 3.62C6.7 4.23 7 5.052 7 5.846c0 .797-.304 1.634-.89 2.24-.589.61-1.353.912-2.11.912-.757 0-1.521-.301-2.11-.911C1.303 7.48 1 6.643 1 5.846c0-.794.301-1.617.89-2.226-.001 0 0 0 0 0L4 1.438z"
        fillRule="evenodd"
        fillOpacity="1"
        fill="#000"
        stroke="none"
      />
    </svg>
  )
}

export const Angle = ({ strokeWidth, className }) => {
  return (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    width="8"
    height="8"
    viewBox="0 0 10 10"
  >
    <path
      d="M0 0v8h8V7H5c0-2.21-1.79-4-4-4V0H0zm1 4v3h3c0-1.657-1.343-3-3-3z"
      fillRule="evenodd"
      fillOpacity="1"
      fill="#000"
      stroke="none"
    />
  </svg>
  )
}

export const Eye = ({ strokeWidth, className }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      width="16"
      height="16"
      viewBox="0 0 16 16"
    >
      <path
        d="M8 10c1.105 0 2-.895 2-2 0-1.105-.895-2-2-2-1.104 0-2 .895-2 2 0 1.105.896 2 2 2z"
        fillRule="nonzero"
        fillOpacity="1"
        fill="#000"
        stroke="none"
      />
      <path
        d="M8 4c2.878 0 5.378 1.621 6.635 4-1.257 2.379-3.757 4-6.635 4-2.878 0-5.377-1.621-6.635-4C2.623 5.621 5.122 4 8 4zm0 7c-2.3 0-4.322-1.194-5.478-3C3.678 6.194 5.7 5 8 5c2.3 0 4.322 1.194 5.479 3C12.322 9.806 10.3 11 8 11z"
        fillRule="evenodd"
        fillOpacity="1"
        fill="#000"
        stroke="none"
      />
    </svg>
  )
}


export const Lock = ({ strokeWidth, className }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      width="16"
      height="16"
      viewBox="0 0 16 16"
    >
      <path
        d="M10 6v1h.5c.276 0 .5.224.5.5v5c0 .276-.224.5-.5.5h-6c-.276 0-.5-.224-.5-.5v-5c0-.276.224-.5.5-.5H9V4.5C9 3.12 10.12 2 11.5 2 12.88 2 14 3.12 14 4.5V6h-1V4.5c0-.828-.672-1.5-1.5-1.5-.828 0-1.5.672-1.5 1.5V6z"
        fillRule="evenodd"
        fillOpacity="1"
        fill="#000"
        stroke="none"
      />
    </svg>
  )
}