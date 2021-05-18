import React, { Component } from 'react';
import DiscoverBlock from './DiscoverBlock/components/DiscoverBlock';
import '../styles/_discover.scss';
import Credentials from '../../../config';
import axios from 'axios';

export default class Discover extends Component {
	constructor() {
		super();
		this.state = {
			newReleases: [],
			playlists: [],
			categories: [],
		};
	}

	componentDidMount() {
		this.getData();
	}
	getData() {
		axios(Credentials.api.authUrl, {
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
				Authorization: 'Basic ' + btoa(Credentials.api.clientId + ':' + Credentials.api.clientSecret),
			},
			data: 'grant_type=client_credentials',
			method: 'POST',
		}).then((tokenResponse) => {
			// return the token

			// get all new release in newRelease state
			axios(`${Credentials.api.baseUrl}/browse/new-releases?`, {
				method: 'GET',
				headers: { Authorization: 'Bearer ' + tokenResponse.data.access_token },
			}).then((genreResponse) => {
				this.setState({ newReleases: genreResponse.data.albums.items });
			});

			// get all new release in playlists state
			axios(`${Credentials.api.baseUrl}/browse/featured-playlists`, {
				method: 'GET',
				headers: { Authorization: 'Bearer ' + tokenResponse.data.access_token },
			}).then((featured) => {
				this.setState({ playlists: featured.data.playlists.items });
			});

			// get all new release in categories state
			axios(`${Credentials.api.baseUrl}/browse/categories`, {
				method: 'GET',
				headers: { Authorization: 'Bearer ' + tokenResponse.data.access_token },
			}).then((categories) => {
				this.setState({ categories: categories.data.categories.items });
			});
		});
	}

	render() {
		const { newReleases, playlists, categories } = this.state;

		return (
			<div className="discover">
				<DiscoverBlock text="RELEASED THIS WEEK" id="released" data={newReleases} />
				<DiscoverBlock text="FEATURED PLAYLISTS" id="featured" data={playlists} />
				<DiscoverBlock text="BROWSE" id="browse" data={categories} imagesKey="icons" />
			</div>
		);
	}
}
