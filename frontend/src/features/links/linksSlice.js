import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getMyLinksAPI, getTopLinksAPI } from '../../api/links.api'

export const fetchMyLinks = createAsyncThunk('links/fetchMyLinks', async () => {
  const res = await getMyLinksAPI()
  return res.data
})

export const fetchTopLinks = createAsyncThunk('links/fetchTopLinks', async () => {
  const res = await getTopLinksAPI()
  return res.data
})

const initialState = {
    links: [],
    topLinks: [],
    loading: false,
    error: null,
}

const linksSlice = createSlice({
    name: 'links',
    initialState,
    reducers: {
        setLinks: (state, action) => {
            state.links = action.payload
        },
        addLinks: (state, action) => {
            state.links.unshift(action.payload)
        }
    },
    extraReducers: (builder) => {
        builder
        .addCase(fetchMyLinks.pending, (state) => { state.loading = true })
        .addCase(fetchMyLinks.fulfilled, (state, action) => {
            state.loading = false
            state.links = action.payload
        })
        .addCase(fetchMyLinks.rejected, (state, action) => {
            state.loading = false
            state.error = action.error.message
        })
        .addCase(fetchTopLinks.fulfilled, (state, action) => {
            state.topLinks = action.payload
        })
    }
})

export const { setLinks, addLinks } = linksSlice.actions
export default linksSlice.reducer