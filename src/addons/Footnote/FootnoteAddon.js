import React, { Component } from 'react';
// import PropTypes from 'prop-types';
import { Plugin, PluginKey } from 'prosemirror-state';
import FootnoteEditable from './FootnoteEditable';
import FootnoteStatic from './FootnoteStatic';

const footnoteKey = new PluginKey('footnote');

/*
All addons get the following props,
but certain schema-based addons may not need them
*/

// const propTypes = {
// 	containerId: PropTypes.string.isRequired,
// 	view: PropTypes.object.isRequired,
// 	editorState: PropTypes.object.isRequired,
// };

class FootnoteAddon extends Component {
	static schema = ()=> {
		return {
			nodes: {
				footnote: {
					atom: true,
					group: 'inline',
					attrs: {
						id: { default: '' },
						value: { default: '' },
						count: { default: 0 },
					},
					inline: true,
					draggable: false,
					selectable: true,
					insertMenu: {
						label: 'Insert Footnote',
						icon: 'pt-icon-asterisk',
						onInsert: (view) => {
							let uniqueHash = '';
							const possible = 'abcdefghijklmnopqrstuvwxyz0123456789';
							for (let index = 0; index < 16; index++) {
								uniqueHash += possible.charAt(Math.floor(Math.random() * possible.length));
							}

							const newNode = view.state.schema.nodes.footnote.create({ id: uniqueHash });
							view.dispatch(view.state.tr.replaceSelectionWith(newNode));
						},
					},
					toEditable(node, view, decorations, isSelected, helperFunctions) {
						return (
							<FootnoteEditable
								value={node.attrs.value}
								count={node.attrs.count}
								isSelected={isSelected}
								view={view}
								{...helperFunctions}
							/>
						);
					},
					toStatic(node) {
						return <FootnoteStatic value={node.attrs.value} count={node.attrs.count} />;
					},
				},
			}
		};
	};

	static getPlugins() {
		return [new Plugin({
			key: footnoteKey,
			view: function() {
				return {
					update: function(view) {
						let footnoteCount = 1;
						for (let nodeIndex = 0; nodeIndex < view.state.doc.nodeSize - 1; nodeIndex++) {
							const curr = view.state.doc.nodeAt(nodeIndex);
							if (curr && curr.type.name === 'footnote') {
								if (curr.attrs.count !== footnoteCount) {
									const transaction = view.state.tr.setNodeMarkup(
										nodeIndex,
										null,
										{
											...curr.attrs,
											count: footnoteCount
										}
									);
									transaction.setMeta('footnote', true);
									view.dispatch(transaction);
								}
								footnoteCount += 1;
							}
						}
					}
				};
			},
		})];
	}

	render() {
		return null;
	}
}

// FootnoteAddon.propTypes = propTypes;
export default FootnoteAddon;
