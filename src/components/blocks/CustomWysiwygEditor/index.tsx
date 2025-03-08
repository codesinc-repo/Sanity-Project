'use client';

import { Box, Container } from '@mantine/core';
import type { FC } from 'react';
import React, { useEffect, useState } from 'react';

import { addTargetSvg } from '@/helpers';

import classes from './CustomWysiwygEditor.module.css';

interface CustomWysiwygEditorProps {
	data: {
		custom_wysiwyg_editor: string;
		hide_this_block: string;
		is_first_block: boolean;
		wrap_in_a_container: string;
	};
}

const CustomWysiwygEditor: FC<CustomWysiwygEditorProps> = ({
	data: { custom_wysiwyg_editor, hide_this_block, wrap_in_a_container, is_first_block },
}) => {
	if (hide_this_block) {
		return null;
	}

	const [processedHtml, setProcessedHtml] = useState<string>(custom_wysiwyg_editor);

	useEffect(() => {
		setProcessedHtml(addTargetSvg(custom_wysiwyg_editor));
	}, [custom_wysiwyg_editor]);

	return (
		<Box className={`${is_first_block ? classes.firstBlock : ''}`}>
			{+wrap_in_a_container ? (
				<Container size="xl">
					<Box
						className={classes.customClassic}
						dangerouslySetInnerHTML={{ __html: processedHtml }}
					/>
				</Container>
			) : (
				<Box
					className={classes.customClassic}
					dangerouslySetInnerHTML={{ __html: processedHtml }}
				/>
			)}
		</Box>
	);
};

export default CustomWysiwygEditor;
