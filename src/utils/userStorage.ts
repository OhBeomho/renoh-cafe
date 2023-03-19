export function setUser(data: any) {
  localStorage.setItem("renoh-cafe:loggedUser", JSON.stringify(data));
}

export function getUser() {
  const user = localStorage.getItem("renoh-cafe:loggedUser");
  return JSON.parse(user || "null");
}

export function removeUser() {
  localStorage.removeItem("renoh-cafe:loggedUser");
}
