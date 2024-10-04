function getTimeString(time) {
  const hour = parseInt(time / 3600);
  let remainingSecond = time % 3600;
  const minute = parseInt(remainingSecond / 60);
  remainingSecond = remainingSecond % 60;
  return `${hour} hour ${minute} minute ${remainingSecond} seconds ago`;
}

const removeActiveClass = () => {
  const buttons = document.getElementsByClassName("category-btn");
  console.log(buttons);

  for (let btn of buttons) {
    btn.classList.remove("active");
  }
};

const loadCategories = () => {
  fetch("https://openapi.programming-hero.com/api/phero-tube/categories")
    .then((res) => res.json())
    .then((data) => displayCategories(data.categories))
    .catch((error) => console.log(error));
};

const loadVideos = (searchText = "") => {
  fetch(
    `https://openapi.programming-hero.com/api/phero-tube/videos?title=${searchText}`
  )
    .then((res) => res.json())
    .then((data) => displayVideos(data.videos))
    .catch((error) => console.log(error));
};

const loadCategoryVideos = (id) => {
  fetch(`https://openapi.programming-hero.com/api/phero-tube/category/${id}`)
    .then((res) => res.json())
    .then((data) => {
      // remove active class
      removeActiveClass();

      // add active class
      const activeBtn = document.getElementById(`btn-${id}`);
      activeBtn.classList.add("active");
      displayVideos(data.category);
    })
    .catch((error) => console.log(error));
};

const loadDetails = async (videoId) => {
  const uri = `https://openapi.programming-hero.com/api/phero-tube/video/${videoId}`;
  const res = await fetch(uri);
  const data = await res.json();
  displayDetails(data.video);
};

const displayDetails = (video) => {
  const detailsContainer = document.getElementById("modal-content");

  detailsContainer.innerHTML = `
    <img class='w-full rounded-xl' src='${video.thumbnail}'/>
    <p class='text-xl font-bold'> ${video.title} </p>
    <p class='text-sm'> ${video.description} </p>
  `;

  // way 1
  document.getElementById("showModalData").click();
  // way 2
  // document.getElementById("customModal").showModal();
};

const displayVideos = (videos) => {
  const videoContainer = document.getElementById("videos");
  videoContainer.innerHTML = "";

  if (videos.length === 0) {
    videoContainer.classList.remove("grid");
    videoContainer.innerHTML = `
      <div class='min-h-[300px] flex flex-col gap-5 justify-center items-center'>
          <img src="./assets/Icon.png"/>
          <h2 class='text-center text-xl font-bold'>No content here in this category</h2>
      </div>
    `;
    return;
  } else {
    videoContainer.classList.add("grid");
  }

  videos.forEach((video) => {
    // console.log(video);

    const card = document.createElement("div");
    card.classList = "card card-compact ";
    card.innerHTML = `
       <figure class='h-[200px] relative'>
        <img
          src=${video.thumbnail}
          class='h-full w-full object-cover'
          alt="Shoes" />
          ${
            video.others.posted_date?.length === 0
              ? ""
              : `<span class='text-xs absolute bottom-2 right-2 bg-black rounded p-1 text-white'> ${getTimeString(
                  video.others.posted_date
                )} </span>`
          }

        </figure>
        <div class="px-0 py-2 flex gap-2">
          <div>
              <img class='w-10 h-10 rounded-full object-cover' src=${
                video.authors[0].profile_picture
              }/>
          </div>
          <div>
              <h2 class='font-bold '>${video.title}</h2>
  
              <div class='flex items-center gap-2'>
                <p class='text-gray-400'>${video.authors[0].profile_name}</p>
                ${
                  video.authors[0].verified === true
                    ? `<img class='w-5' src='https://img.icons8.com/?size=48&id=D9RtvkuOe31p&format=png' />`
                    : ""
                }
              </div>
              <div class="flex gap-24">
                <p class="text-gray-500"> ${video.others.views} Views</p>
                <p> <button onclick="loadDetails('${video.video_id}')"
                            class="btn btn-outline btn-xs btn-info">Details</button>
                </p>
              </div>
          </div>
        </div>
    `;

    videoContainer.append(card);
  });
};

const displayCategories = (categories) => {
  const categoryContainer = document.getElementById("categories");

  categories.forEach((item) => {
    const buttonContainer = document.createElement("div");
    buttonContainer.innerHTML = `
      <button id="btn-${item.category_id}"
       onclick="loadCategoryVideos(${item.category_id})" 
       class='btn btn-outline category-btn'>
        ${item.category}
      </button>
    `;

    // add button to category container
    categoryContainer.append(buttonContainer);
  });
};

document.getElementById("search-input").addEventListener("keyup", (e) => {
  console.log(e.target.value);
  loadVideos(e.target.value);
});

loadCategories();
loadVideos();
