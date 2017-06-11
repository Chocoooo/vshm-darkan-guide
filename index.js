const BossId = [981, 1000]; // Darkan HM

module.exports = function VSNMLakanGuide(dispatch) {
    
    //Messages
    let warningAt50 = 'Boss is under 50%! Prepare for double side attacks';
    let warning = 'Double side attacks incoming!';
    
    let boss = null;
    let giveWarnings = false;
    let doubleSwingsWarned = false;
    let attack1 = false;
    let attack2 = false;
    let sideAttacks = [1205142605, 1205142606, 1205143606, 1205143605];
    
	function bossHealth() {
		return (boss.curHp / boss.maxHp);
	}
    
	dispatch.hook('S_BOSS_GAGE_INFO', 2, (event) => {
        if (event.huntingZoneId === BossId[0] && event.templateId === BossId[1])
        {
            boss = event;       
        }
            if(boss)
            {
                let bossHp = bossHealth();
                
                if(bossHp > 0.50)
                {
                    giveWarnings = false;
                }
                else if(bossHp <= 0.50 && !doubleSwingsWarned)
                {
                    giveWarnings = true;
                    sendMessage(warningAt50);
                    doubleSwingsWarned = true;
                }
                else if(bossHp <= 0)
                {
                    boss = undefined;
                    giveWarnings = false;
                    doubleSwingsWarned = false;
                }
            }
    })
     
     dispatch.hook('S_ACTION_STAGE', 1, (event) => {
         if(!boss)
             return;
         
         if(boss.id - event.source == 0 && giveWarnings)
         { 
                console.log(event.skill);
        
             if(sideAttacks.includes(event.skill) && !attack1)
             {
                 attack1 = true;
             }
             else if(sideAttacks.includes(event.skill) && attack1 && !attack2)
             {
                 attack2 = true;
             }
             else if(sideAttacks.includes(event.skill) && attack1 && attack2)
             {
                 sendMessage(warning);
                 attack1 = false;
                 attack2 = false;
             }
             else
             {
                 attack1 = false;
                 attack2 = false;
             }
         }
     })
     
	function sendMessage(msg) {
        dispatch.toClient('S_CHAT', 1, {
            channel: 21,
            authorName: 'DG-Guide',
            message: msg
        });	
	}	
}
