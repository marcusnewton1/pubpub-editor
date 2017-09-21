import { Button, Dialog } from '@blueprintjs/core';
import React, { PropTypes } from 'react';

export const ImageFileUploader = React.createClass({
	propTypes: {
		onClose: PropTypes.func,
		isOpen: PropTypes.bool,
		onFileSelect: PropTypes.func,
	},

	render() {
		return (
			<Dialog isOpen={this.props.isOpen} onClose={this.props.onClose} title={'Upload Files'}>
				<div className="pt-dialog-body">
					<label htmlFor={'upload-media-input'} className="pt-button">
						Choose File to Upload
						<input id={'upload-media-input'} type="file" onChange={this.props.onFileSelect} style={{ position: 'fixed', top: '-1000px' }} />
					</label>
				</div>
			</Dialog>
		);

	}
});

export default ImageFileUploader;
