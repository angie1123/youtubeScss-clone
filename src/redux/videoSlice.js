import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import request from '../api'
export const getPopularVideos = createAsyncThunk(
  "videos/getPopularVideos",
  async (_, { rejectWithValue,getState }) => {
    try {
      const res = await request.get('/videos', {
        params: { 

          part: "snippet,contentDetails,statistics",
          chart: "mostPopular",
          regionCode: "MY",
          maxResults: 20,  // limit to 50 items  per request
          pageToken: getState().videos.nextPageToken
        }
      });
      console.log(res)
      console.log(res.data.items)

      return {
        videos: res.data.items,
        nextPageToken: res.data.nextPageToken,
        category:'All'
      }
    } catch (error) {
     console.log(error.message)
      return rejectWithValue(error.message);
    }
  }
);

export const getChannelIcon = createAsyncThunk(
  "videos/getChannelIcon",
  async (channelId,{rejectWithValue}) => {
    try {
      const { data: { items } } = await request.get('/channels', {
        params: {
          part:'snippet',
          id: channelId
        }
      })
      // console.log(items)
      return items[0]
    } catch (error) {
      return rejectWithValue(error.message)
    }   
  })

export const getVideosByCategory = createAsyncThunk(
  "videos/getVideoByCategory",
  /*
  In the createAsyncThunk function, the first parameter is the
  input argument passed when the thunk is dispatched, and the
  second parameter is an object containing additional utilities
  provided by Redux Toolkit.
   */
  async (keyword, { getState,rejectWithValue }) => {
    try {
      /*
      get nextPageToken state from videos slice using getState() function
      */
      const { nextPageToken } = getState().videos
      
      /*Endpoint: /search is used to search for
       YouTube videos.
      */  
      const res = await request('/search', {
        params: {
          part: 'snippet',
          maxResults: 20,
          pageToken: nextPageToken,
          /*The q parameter in the YouTube Data API is typically
           used as a search query parameter. It allows you to 
           specify a text string to search for videos, playlists,
           or channels that match the query. */
          q: keyword,
          type:'video'
        }
      })
      console.log(res)
      // loop through items array in data get the video id of each item
      const videoIds = res.data.items.map(item => item.id.videoId).join(',');

      // Get full video details
      /*
      data: Original property name in the object.
      videoData: The new variable name you want to use.
      */
      const { data: videoData } = await request.get('/videos', {
        params: {
          part: 'snippet,contentDetails,statistics',
          id: videoIds,//retrive specific video based on videoIds
        }
      });
      console.log(videoData)

      
      return {
        videos: videoData,
        nextPageToken: res.data.nextPageToken,
        category: keyword,
      };
    }catch (error) {
    console.log(error)
      return rejectWithValue(error.message)
    }
  }
  )




const videoSlice = createSlice({
  name: "videos",
  initialState: {
    videos: [],
    /*
    With an object {}, you can directly access the icon using the channel ID
    as a key - O(1) time complexity:
    
    With an array [], you'd need to iterate through the entire array to find
    a specific channel's icon:
    */
    channelIcons: {},//store icons for each channel by id
    loading: true,
    nextPageToken: null,
    activeCategory:'All'
  },
  
  extraReducers: (builder) => {
    builder
      .addCase(getPopularVideos.fulfilled, (state, action) => {
        const { videos, nextPageToken,category } = action.payload
        

        if (state.activeCategory === category) {
          //create an array which key is video.id ,and value is video object
          const videoMap = new Map(state.videos.map(video => [video.id, video]))
          videos.forEach(video => {
            //if videos doesnt have video.id
            if (!videoMap.has(video.id)) {
              videoMap.set(video.id, video)//set current video.id as key and object as value
            }
          })
          state.videos=Array.from(videoMap.values())
        } else {
          state.videos=videos
        }
        
        state.nextPageToken = nextPageToken
        state.loading = false
        // console.log(state.videos)
      

      })
    
      .addCase(getChannelIcon.fulfilled, (state, action) => {
        //store channel icon by id
        state.channelIcons[action.payload.id] = action.payload.snippet.thumbnails.default.url
        /*
          channelIcons[action.payload.id] ="UC123": { data: {...} },
        */
      })
    
      .addCase(getVideosByCategory.fulfilled, (state, action) => {
      const{videos,nextPageToken,category}=action.payload
      state.videos = videos.items;
      state.loading = false;
      state.nextPageToken = nextPageToken;
      state.category = category;
      })
  }
})

export default videoSlice.reducer