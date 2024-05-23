export async function fetchGet(url) {
  let data;
  try{
      const response = await fetch(url, 
          {
              credentials: "include",
          });
          const result = await response.json();
          data = result.data;
  } catch (error) {
      console.log(error);
  }
  return data;
}

export async function fetchPost(url, body) {
  return fetch(url, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  })
    .then((response) => response.json())
    .then((result) => {return result})
    .catch((error) => console.error(error));
}