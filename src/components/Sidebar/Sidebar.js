import React, { useState, useEffect } from 'react';
import * as s from './Sidebar.styles';

const Sidebar = props => {
  const { 
    backgroundImage = '', 
    sidebarHeader = {
      fullName: '',
      shortName: ''
    },
    menuItems = [],
    fonts = {
      header: '',
      menu: ''
    }
  } = props;

  // State
  const [selected, setSelectedMenuItem] = useState(menuItems[0].name);
  const [isSidebarOpen, setSidebarState] = useState(true);
  const [header, setHeader] = useState(sidebarHeader.fullName);
  const [subMenusStates, setSubmenus] = useState({})

  // Effects

  // Update of header state
  useEffect(() => {
    isSidebarOpen ? setTimeout(() => setHeader(sidebarHeader.fullName), 200) : setHeader(sidebarHeader.shortName);
  }, [isSidebarOpen, sidebarHeader])

  const handleMenuItemClick = name => {
    setSelectedMenuItem(name)
  }


  // Update of sidebar state
  useEffect(() => {
    const updateWindowWidth = () => {
      if (window.innerWidth < 1280 && isSidebarOpen) setSidebarState(false);
      else setSidebarState(true)
    }

    window.addEventListener('resize', updateWindowWidth);

    return () => window.removeEventListener('resize', updateWindowWidth);
  }, [isSidebarOpen]);


  // Add index of items that contain sub menu items
  useEffect(() => {
    const newSubmenus = {};

    menuItems.forEach((item, index) => {
      const hasSubmenus = !!item.subMenuItems.length;

      if (hasSubmenus) {
        newSubmenus[index] = {};
        newSubmenus[index]['isOpen'] = false;
        newSubmenus[index]['selected'] = null;
      }
    })

    setSubmenus(newSubmenus);
  }, [menuItems]);

  console.log(subMenusStates)

  const menuItemsJSX = menuItems.map((item, index) => {
    const isItemSelected = selected === item.name;

    const hasSubmenus = !!item.subMenuItems.length;

    const subMenusJSX = item.subMenuItems.map((subMenuItem, subMenuItemIndex) => {
      return (
        <s.SubMenuItem key={subMenuItemIndex}>{subMenuItem.name}</s.SubMenuItem>
      )
    })

    return (
      <s.ItemContainer key={index}>
        <s.MenuItem           
          font={fonts.menu}
          selected={isItemSelected}
          onClick={() => handleMenuItemClick(item.name)}
          isSidebarOpen={isSidebarOpen}
        >
          <s.Icon isSidebarOpen={isSidebarOpen} src={item.icon} />
          <s.Text isSidebarOpen={isSidebarOpen}>{item.name}</s.Text>
          {hasSubmenus && isSidebarOpen && (
            <s.DropdownIcon selected={isItemSelected} />
          )}
        </s.MenuItem>

        {/* Display submenus if they exist  */}
          <s.SubMenuItemContainer isSidebarOpen={isSidebarOpen}>{subMenusJSX}</s.SubMenuItemContainer>
      </s.ItemContainer>
    )
  });

  return (
    <s.SidebarContainer backgroundImage={backgroundImage} isSidebarOpen={isSidebarOpen}>
      <s.SidebarHeader font={fonts.header}>{header}</s.SidebarHeader>
      <s.MenuItemContainer>{menuItemsJSX}</s.MenuItemContainer>
      <s.TogglerContainer onClick={() => setSidebarState(!isSidebarOpen)}>
        <s.Toggler />
      </s.TogglerContainer>
    </s.SidebarContainer>
  )
}

export default Sidebar