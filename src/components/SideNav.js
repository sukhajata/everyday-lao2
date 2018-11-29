import React from 'react';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { Collapse } from '@material-ui/core';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';

export default function SideNav({ styles, toggleExpand, categories, categoriesOpen, selectSubcategory, showFavourites }) {
    
    return  (
        <div className={styles.list}>
            <List>
            {categories.map(category => (
                <div key={category.id}>
                    <ListItem button  onClick={() => toggleExpand(category.id)}>
                        <ListItemText primary={category.c_name} />
                        {categoriesOpen[category.id] ? <ExpandLess /> : <ExpandMore />}
                    </ListItem>
                    
                    <Collapse in={categoriesOpen[category.id]} timeout="auto" unmountOnExit>
                        <List component="div" disablePadding>
                        {category.subCategories.map(subcategory => (
                            <ListItem button key={subcategory.id} onClick={() => selectSubcategory(subcategory.id)}>
                            <ListItemText inset primary={subcategory.c_name} />
                            </ListItem>
                        ))}
                        </List>
                    </Collapse>
                </div>
            ))}
            <ListItem button  onClick={() => showFavourites()}>
                <ListItemText primary="Favourites" />
            </ListItem>
            </List>
        </div>
    )
}