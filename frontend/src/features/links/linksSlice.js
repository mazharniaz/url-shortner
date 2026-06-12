import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    links: [],
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
    }
})

export const { setLinks, addLinks } = linksSlice.actions
export default linksSlice.reducer