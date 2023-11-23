
// Global variable to store Xano data
let xanoData = fetchDataFromXano(2);

document.addEventListener("DOMContentLoaded", function() {
  xanoData.then((value) => {
    console.log(value);
    createHeaderItems(value);
    createInteriorItems(value);
    createReviewItems(value);
    createMenuItems(value);
    createEventItems(value);
    createPostItems(value);
    createInfoSectinItems(value);
    createFooterItems(value);
  });

});


function createHeaderItems (xanoData) {
  const sections = ['Interior', 'Info', 'Menu', 'Posts', 'Events', 'Reviews'];

        // Generating the links
        const horizontalMenu = document.getElementById('horizontalMenu');
        sections.forEach(section => {
            const link = document.createElement('a');
            link.href = `#${section.toLowerCase()}`;
            link.textContent = section;
            link.addEventListener('click', smoothScroll);
            horizontalMenu.appendChild(link);
        });

        // Smooth scroll function
        function smoothScroll(event) {
            event.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            if (targetElement) {
                window.scroll({
                    behavior: 'smooth',
                    left: 0,
                    top: targetElement.offsetTop
                });
            }
        }

        // Add images to cover and logo
        const coverImage = document.getElementById('coverImage');
        coverImage.style.background = `url('${xanoData.cover_photo_url}') no-repeat center`;
        coverImage.style.backgroundSize = 'cover';
        //coverImage.style.visibility = "hidden";

        const logoImage = document.getElementById('logoImage');
        logoImage.style.background = `url('${xanoData._main_users.profile_picture}') no-repeat center`;;
        logoImage.style.backgroundSize = 'cover';
        //logoImage.style.visibility = "hidden";

        const aboutHeaderTitle = document.getElementById('aboutHeaderTitle');
        aboutHeaderTitle.textContent = "About Us";

        const aboutParagraph = document.getElementById('aboutParagraph');
        aboutParagraph.textContent = xanoData.bio;
}



function createInteriorItems(xanoData){
  // JavaScript code to populate the masonry interior items
const masonryInteriorContainer = document.getElementById('masonry-interior-container');
const masonryInteriorItemsCount = xanoData.BusinessPictures.length; // Change this as needed

for (let i = 0; i < masonryInteriorItemsCount; i++) {
    const masonryInteriorItem = document.createElement('div');
    masonryInteriorItem.classList.add('masonry-interior-item');

    // Adding an image to each item
    const image = document.createElement('img');
    image.src = `${xanoData.BusinessPictures[i]}`; // Replace with the actual path to your image
    masonryInteriorItem.appendChild(image);

    masonryInteriorContainer.appendChild(masonryInteriorItem);
}

}



function createReviewItems (xanoData){
  // Constants
const ELEMENT_IDS = {
  MAIN_USER: 'mainUser',
  REVIEW_CARD: 'reviewCard',
};

// Factory function for creating elements
function createElement(tag, attributes = {}, textContent = '') {
  const element = document.createElement(tag);
  Object.entries(attributes).forEach(([key, value]) => element.setAttribute(key, value));
  element.textContent = textContent;
  return element;
}

// Function to create a circular image element
function createCircularImage(src, alt) {
  return createElement('img', { src, alt, class: 'circular-image' });
}

// Function to create a user section
function createUserSection(imageSrc, username, date) {
  const userSection = createElement('div', { class: 'user-section' });
  userSection.appendChild(createCircularImage(imageSrc, username));

  const userInfo = createElement('div', { class: 'user-info' });
  userInfo.appendChild(createElement('p', {}, username));
  userInfo.appendChild(createElement('p', {}, date));

  userSection.appendChild(userInfo);
  return userSection;
}

// Function to create a comment section
function createCommentSection(commentData) {
  const { userImage, username, date, comment } = commentData;
  const commentSection = createElement('div', { class: 'comment-section' });
  commentSection.appendChild(createUserSection(userImage, username, date));
  commentSection.appendChild(createElement('p', {}, comment));
  return commentSection;
}

// Function to create a review card
function createReviewCard(reviewCardData) {
  const { header, imageSrc, text, cardsData, commentsData, reviewString, reviewLink } = reviewCardData;
  const reviewCard = document.getElementById(ELEMENT_IDS.REVIEW_CARD);
  reviewCard.innerHTML = ''; // Clear previous content

  reviewCard.appendChild(createElement('h2', {}, header));

  const cardRow = createElement('div', { class: 'card-row' });
  cardRow.appendChild(createCircularImage(imageSrc, 'Review Image'));
  cardRow.appendChild(createElement('p', {}, text));
  reviewCard.appendChild(cardRow);

  const cardsSection = createElement('div', { class: 'cards-section' });
  cardsData.forEach(cardData => {
      const card = createElement('div', {});
      const [string1, string2] = cardData.split('|');
      card.appendChild(createElement('p', {}, string1));
      card.appendChild(createElement('p', {}, string2));
      cardsSection.appendChild(card);
  });
  reviewCard.appendChild(cardsSection);

  const cardCommentSection = createElement('div', { class: 'card-comment-section' });
  commentsData.forEach(commentData => {
      const comment = createCommentSection(commentData);
      cardCommentSection.appendChild(comment);
  });
  reviewCard.appendChild(cardCommentSection);

  const reviewStringElement = createElement('a', { href: reviewLink, target: '_blank' }, reviewString);
    reviewCard.appendChild(reviewStringElement);
}

// Function to create the main user section
function createMainUser(mainUserData) {
  const { imageSrc, username } = mainUserData;
  const mainUser = document.getElementById(ELEMENT_IDS.MAIN_USER);
  mainUser.innerHTML = ''; // Clear previous content
  mainUser.appendChild(createCircularImage(imageSrc, username));
  mainUser.appendChild(createElement('p', {}, username));
}

// Example data
const mainUserData = { imageSrc: 'path/to/main-user-image.jpg', username: 'Main User' };
const commentList = [];

for(let i = 0; i < xanoData._business_reviews_of_business.length; i++){
  commentList[i] = { 
  userImage: xanoData._business_reviews_of_business[i]._main_users_for_business_reviews.profile_picture, 
  username: xanoData._business_reviews_of_business[i]._main_users_for_business_reviews.name, 
  date: Date(xanoData._business_reviews_of_business[i].created_at),
  comment: xanoData._business_reviews_of_business[i].review_description
};

}

const reviewCardData = {
  header: `What ${xanoData._business_reviews_of_business.length} Are saying `,
  imageSrc: 'path/to/review-image.jpg',
  text: ` ${xanoData._overal_business_reviews_of_business.overal_business_score} based on recent ratings `,
  cardsData: [
    `${xanoData._overal_business_reviews_of_business.overal_menu_item_score}|Food`, 
    `${xanoData._overal_business_reviews_of_business.overal_service_score}|Service`, 
    `${xanoData._overal_business_reviews_of_business.overal_ambience_score}|Ambience`, 
    `${xanoData._overal_business_reviews_of_business.overal_value_score}|Value`
  ],
  commentsData: commentList,
  reviewString: `View all ${xanoData._business_reviews_of_business.length} Reviews `,
  reviewLink: 'https://example.com/full-review',
};

// Populate the sections with data
createMainUser(mainUserData);
createReviewCard(reviewCardData);

}



function createMenuItems(xanoData){
  // JavaScript code to populate the menu navigation items
const menuNavigationItems = ['Item 1', 'Item 2', 'Item 3', 'Item 4', 'Item 5', 'Item 6', 'Item 7'];
const menuNavigationItemsList = document.getElementById('menu-navigation-items');

menuNavigationItems.forEach((itemText) => {
    const menuNavigationListItem = document.createElement('li');
    const menuNavigationItemLink = document.createElement('a');
    menuNavigationItemLink.href = '#'; // Add your link destinations here
    menuNavigationItemLink.textContent = itemText;
    menuNavigationListItem.appendChild(menuNavigationItemLink);
    menuNavigationItemsList.appendChild(menuNavigationListItem);
});

// JavaScript code to populate the menu grid items
const menuGrid = document.getElementById('menu-grid');
const menuGridItemsCount = 9; // Change this as needed

for (let i = 1; i <= menuGridItemsCount; i++) {
    const menuGridItem = document.createElement('div');
    menuGridItem.classList.add('menu-grid-item'); // Adding the 'card' class

    // Creating the card structure
    const image = document.createElement('img');
    image.classList.add('menu-grid-item-image');
    image.src = 'path_to_image.jpg'; // Replace with the actual path
    menuGridItem.appendChild(image);

    const title1 = document.createElement('div');
    title1.classList.add('menu-grid-item-title');
    title1.textContent = 'Title 1';
    menuGridItem.appendChild(title1);

    const title2 = document.createElement('div');
    title2.classList.add('menu-grid-item-title');
    title2.textContent = 'Title 2';
    menuGridItem.appendChild(title2);

    const paragraph = document.createElement('p');
    paragraph.classList.add('menu-grid-item-paragraph');
    paragraph.textContent = 'Some sample text goes here...';
    menuGridItem.appendChild(paragraph);

    menuGrid.appendChild(menuGridItem);
}

}



function createEventItems(xanoData){
// create event header background image
const eventBox = document.getElementById("event-box");

const eventBoxImage = document.createElement("img");
eventBoxImage.className = "event-box-image"; 

eventBoxImage.src = ""; 
eventBoxImage.alt = "Event Header Image";


eventBox.appendChild(eventBoxImage);

// JavaScript code to populate the masonry event items
const masonryEventContainer = document.getElementById("masonry-event-container");
const eventItems = [];
const eventComments = [];

for(let i = 0; i < xanoData._events_of_business.length; i++){
  eventComments[i] = [];
  for(let j = 0; j < xanoData._events_of_business[i]._event_comments_list_of_events.length; j++){
    eventComments[i][j] = {
      name: xanoData._events_of_business[i]._event_comments_list_of_events[j]._main_users_for_event_comments.name, 
      comment: xanoData._events_of_business[i]._event_comments_list_of_events[j].description, 
      image: xanoData._events_of_business[i]._event_comments_list_of_events[j]._main_users_for_event_comments.profile_picture
    }
  }
}

for(let i = 0; i < xanoData._events_of_business.length; i++){ 
    eventItems[i] = {
      header: `@ ${xanoData._events_of_business[i].label}`,
      image: `${xanoData._events_of_business[i].cover_photo}`,
      paragraph: `${xanoData._events_of_business[i].description}`,
      rows: [`${Date(xanoData._events_of_business[i].event_date)}`, `${xanoData._events_of_business[i].going_users_count} Are Going`, `${xanoData._events_of_business[i].location}`],
      comments: eventComments[i]
    }
}

// Function to create the comment section for an item
function createEventCommentSection(comments) {
    const commentsSection = document.createElement("div");
    commentsSection.classList.add("event-comments");
  
    comments.forEach((comment) => {
      const commentElement = document.createElement("div");
      commentElement.classList.add("event-comment");
  
      const userImage = document.createElement("img");
      userImage.src = comment.image; // Replace with the actual path
      commentElement.appendChild(userImage);
  
      const userContent = document.createElement("div"); // New div to contain userName and userComment
      userContent.classList.add("user-content");
  
      const userName = document.createElement("p");
      userName.textContent = comment.name;
      userContent.appendChild(userName);
  
      const userComment = document.createElement("p");
      userComment.textContent = comment.comment;
      userContent.appendChild(userComment);
  
      commentElement.appendChild(userContent);
  
      commentsSection.appendChild(commentElement);
    });
  
    return commentsSection;
  }
  

// Populate the masonry event container with items
eventItems.forEach((item) => {
  const masonryEventItem = document.createElement("div");
  masonryEventItem.classList.add("masonry-event-item");

  // Card structure
  const card = document.createElement("div");
  card.classList.add("event-card");

  // Header
  const header = document.createElement("h3");
  header.classList.add("event-card-header");
  header.textContent = item.header;
  card.appendChild(header);

  // Image
  const image = document.createElement("img");
  image.src = item.image;
  card.appendChild(image);

  // Paragraph
  const paragraph = document.createElement("p");
  paragraph.textContent = item.paragraph;
  card.appendChild(paragraph);

  // Rows
  const rows = document.createElement("div");
  rows.classList.add("event-rows");
  item.rows.forEach((row) => {
    const rowElement = document.createElement("div");
    rowElement.textContent = row;
    rows.appendChild(rowElement);
  });
  card.appendChild(rows);

  // Comments
  const commentsSection = createEventCommentSection(item.comments);
  card.appendChild(commentsSection);

  masonryEventItem.appendChild(card);
  masonryEventContainer.appendChild(masonryEventItem);
});
}



function createPostItems(xanoData){
  const postsData = [];
  const postComments = [];
  
  for(let i = 0; i < xanoData._posts_of_main_users.length; i++){
    postComments[i] = [];
    for(let j = 0; j < xanoData._posts_of_main_users[i]._post_comment_list_of_posts.length; j++){
      postComments[i][j] = {
        userImage: xanoData._posts_of_main_users[i]._post_comment_list_of_posts[j]._main_users_for_post_comments.profile_picture, 
        username: xanoData._posts_of_main_users[i]._post_comment_list_of_posts[j]._main_users_for_post_comments.name, 
        comment: xanoData._posts_of_main_users[i]._post_comment_list_of_posts[j].description
      }
    }
  }
  
  for(let i = 0; i < xanoData._posts_of_main_users.length; i++){ 
    postsData[i] = {
      imageUrls: xanoData._posts_of_main_users[i].photo_url != null ? xanoData._posts_of_main_users[i].photo_url : [],
      // imageUrls: ["https://pbs.twimg.com/media/F8RStAlWkAAyIWd?format=jpg&name=large", "https://pbs.twimg.com/media/F8RStAlWkAAyIWd?format=jpg&name=large"],
      reactions: [
        { image: 'reaction_image1.jpg', text: "Like" },
        { image: 'reaction_image2.jpg', text: 'Comment' },
        { image: 'reaction_image3.jpg', text: 'Share' }
      ],
      paragraph: xanoData._posts_of_main_users[i].description,
      comments: postComments[i]
      }
  }  


// Function to create a single post card
function createPostCard(post) {
  const card = document.createElement('div');
  card.classList.add('posts-card');

  // const image = document.createElement('img');
  // image.src = post.imageUrls;
  // card.appendChild(image); 

  // Create a container for the Swiper slider
  const sliderContainer = document.createElement('div');
  sliderContainer.classList.add('swiper-container');

  // Create a wrapper for slides
  const slidesWrapper = document.createElement('div');
  slidesWrapper.classList.add('swiper-wrapper');

  // Create individual slides for each image
  post.imageUrls.forEach(imageUrl => {
    const slide = document.createElement('div');
    slide.classList.add('swiper-slide');

    const image = document.createElement('img');
    image.src = imageUrl;
    slide.appendChild(image);

    slidesWrapper.appendChild(slide);
  });

  sliderContainer.appendChild(slidesWrapper);
  card.appendChild(sliderContainer);

  // Initialize Swiper
  const swiper = new Swiper(sliderContainer, {
    slidesPerView: 1,
    spaceBetween: 10,
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
    },
  });


  // Reactions Row
  const reactionsRow = document.createElement('div');
  reactionsRow.classList.add('posts-reactions-row');

  post.reactions.forEach(reaction => {
    const reactionColumn = document.createElement('div');
    reactionColumn.classList.add('posts-reactions-column');

    const reactionImage = document.createElement('img');
    reactionImage.src = reaction.image;
    reactionColumn.appendChild(reactionImage);

    const reactionText = document.createElement('p');
    reactionText.textContent = reaction.text;
    reactionColumn.appendChild(reactionText);

    reactionsRow.appendChild(reactionColumn);
  });

  card.appendChild(reactionsRow);

  // Paragraph
  const paragraph = document.createElement('p');
  paragraph.classList.add('posts-paragraph');
  paragraph.textContent = post.paragraph;
  card.appendChild(paragraph);

  // Comment Section
  const commentSection = document.createElement('div');
  commentSection.classList.add('posts-comment-section');

  post.comments.forEach(comment => {
    const commentItem = document.createElement('div');
    commentItem.classList.add('posts-comment');

    const userImage = document.createElement('img');
    userImage.src = comment.userImage;
    userImage.classList.add('posts-user-image');
    userImage.id = 'posts-user-image';
    commentItem.appendChild(userImage);

    const userContent = document.createElement('div');
    userContent.classList.add('posts-user-content');

    const username = document.createElement('p');
    username.textContent = comment.username;
    userContent.appendChild(username);

    const userComment = document.createElement('p');
    userComment.textContent = comment.comment;
    userComment.classList.add('posts-user-comment');
    userContent.appendChild(userComment);

    commentItem.appendChild(userContent);
    commentSection.appendChild(commentItem);
  });

  card.appendChild(commentSection);

  return card;
}

// Adding posts to the page
const postsSection = document.getElementById('posts');
const header = document.createElement('div');
header.classList.add('header');
header.innerHTML = '<h2>Posts</h2>';
postsSection.appendChild(header);

const flexboxGrid = document.createElement('div');
flexboxGrid.classList.add('posts-flexbox-grid');
postsData.forEach(post => {
  const card = createPostCard(post);
  flexboxGrid.appendChild(card);
});

postsSection.appendChild(flexboxGrid);
}


function createInfoSectinItems(xanoData){
//  javascript code for info section //

// Sample data for working hours and contact info
const workingHoursData = [
  "Monday: 9:00 AM - 5:00 PM",
  "Tuesday: 9:00 AM - 5:00 PM",
  "Wednesday: 9:00 AM - 5:00 PM",
  "Thursday: 9:00 AM - 5:00 PM",
  "Friday: 9:00 AM - 5:00 PM",
  "Saturday: 10:00 AM - 3:00 PM",
  "Sunday: Closed"
];

contactInfoData = [
  "Address: 123 Street, City, Country",
  "Phone: +1234567890",
  "xanoData.email",
  "Fax: +1234567890",
  "Website: www.example.com"
];

// Function to populate the working hours section
function populateWorkingHours() {
  const workingHoursContainer = document.querySelector('.working-hours');
  workingHoursData.forEach((item) => {
    const row = document.createElement('div');
    row.textContent = item;
    workingHoursContainer.appendChild(row);
  });
}

// Function to populate the contact info section
function populateContactInfo() {
  const contactInfoContainer = document.querySelector('.contact-info');
  contactInfoData.forEach((item) => {
    const row = document.createElement('div');
    row.textContent = item;
    contactInfoContainer.appendChild(row);
  });
}

// Call the functions to populate the sections
populateWorkingHours();
populateContactInfo();
}


function createFooterItems(xanoData){
// JavaScript code for creating dynamic content in the footer

// Function to create and append elements
const createAndAppendElement = (parent, elementType, content, href) => {
  const element = document.createElement(elementType);
  element.textContent = content;
  if (href) {
      element.href = href;
  }
  parent.appendChild(element);
  return element;
};

// Logo placeholder
const logoPlaceholder = document.getElementById('logo-placeholder');
createAndAppendElement(logoPlaceholder, 'img', 'Your Logo', 'your_logo_url_here');
// Replace 'Your Logo' with the actual image source and other attributes

// Social links
const socialLinks = document.getElementById('social-links');
const socialLinksArray = ['Link 1', 'Link 2', 'Link 3', 'Link 4', 'Link 5'];
socialLinksArray.forEach(link => {
  createAndAppendElement(socialLinks, 'a', link, '#');
});

// Dynamic lists
const populateList = (list, dataArray) => {
  dataArray.forEach(item => {
      createAndAppendElement(list, 'li', item);
  });
};

// Product list
const productList = document.getElementById('product-list');
const productsArray = ['Product 1', 'Product 2', 'Product 3', 'Product 4'];
populateList(productList, productsArray);

// Service list
const serviceList = document.getElementById('service-list');
const servicesArray = ['Service 1', 'Service 2', 'Service 3', 'Service 4'];
populateList(serviceList, servicesArray);

// Resource list
const resourceList = document.getElementById('resource-list');
const resourcesArray = ['Resource 1', 'Resource 2', 'Resource 3', 'Resource 4'];
populateList(resourceList, resourcesArray);
}




























