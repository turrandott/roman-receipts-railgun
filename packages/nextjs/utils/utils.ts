export const copyToClipboard = (data: string) => {
  const elId = Date.now().toString();
  const el = document.createElement("textarea");
  el.setAttribute("id", elId);
  el.value = data;
  document.body.appendChild(el);
  document.getElementById(elId).select();
  document.execCommand("copy");
  document.getElementById(elId).style.display = "none";
  document.getElementById(elId).remove();
  alert("url copied");
};
