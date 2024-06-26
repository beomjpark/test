﻿class Breakout extends Phaser.Scene
{
    constructor ()
    {
        super({ key: 'breakout' });

        this.bricks;
        this.paddle;
        this.ball;
    }

    preload ()
    {
        this.load.setBaseURL('https://labs.phaser.io');
        this.load.atlas('assets', 'assets/games/breakout/breakout.png', 'assets/games/breakout/breakout.json');
    }

    create ()
    {
        //  Enable world bounds, but disable the floor
        this.physics.world.setBoundsCollision(true, true, true, false);

        //  Create the bricks in a 10x6 grid
        // this.bricks = this.physics.add.staticGroup({
        //     key: 'assets', frame: [ 'blue1', 'red1', 'green1'], // 'yellow1', 'silver1', 'purple1' 
        //     frameQuantity: 10,
        //     gridAlign: { width: 10, height: 10, cellWidth: 32, cellHeight: 32, x: 5, y: 100 }
        // });
        // for(var y = 0; y < 4; y++)
        // {
        //     for(var x = 0; x < 4; x++)
        //     {
        //         brick = bricks.create(5 + (x * 64), 100 + (y * 32), 'assets', 'green');
        //     }
        // }

        this.ball = this.physics.add.image(400, 500, 'assets', 'ball1').setCollideWorldBounds(true).setBounce(1);
        this.ball.setData('onPaddle', true);

        this.paddle = this.physics.add.image(400, 550, 'assets', 'paddle1').setImmovable();

        //  Our colliders
        this.physics.add.collider(this.ball, this.bricks, this.hitBrick, null, this);
        this.physics.add.collider(this.ball, this.paddle, this.hitPaddle, null, this);

        //  Input events
        this.input.on('pointermove', function (pointer)
        {

            //  Keep the paddle within the game
            this.paddle.x = Phaser.Math.Clamp(pointer.x, 52, 748);

            if (this.ball.getData('onPaddle'))
            {
                this.ball.x = this.paddle.x;
            }

        }, this);

        this.input.on('pointerup', function (pointer)
        {

            if (this.ball.getData('onPaddle'))
            {
                this.ball.setVelocity(-75, -300);
                this.ball.setData('onPaddle', false);
            }

        }, this);
    }

    hitBrick (ball, brick)
    {
        brick.disableBody(true, true);

        if (this.bricks.countActive() === 0)
        {
            this.resetLevel();
        }
    }

    resetBall ()
    {
        this.ball.setVelocity(0);
        this.ball.setPosition(this.paddle.x, 500);
        this.ball.setData('onPaddle', true);
    }

    resetLevel ()
    {
        this.resetBall();

        this.bricks.children.each(brick =>
        {

            brick.enableBody(false, 0, 0, true, true);

        });
    }

    hitPaddle (ball, paddle)
    {
        let diff = 0;

        if (ball.x < paddle.x)
        {
            //  Ball is on the left-hand side of the paddle
            diff = paddle.x - ball.x;
            ball.setVelocityX(-10 * diff);
        }
        else if (ball.x > paddle.x)
        {
            //  Ball is on the right-hand side of the paddle
            diff = ball.x - paddle.x;
            ball.setVelocityX(10 * diff);
        }
        else
        {
            //  Ball is perfectly in the middle
            //  Add a little random X to stop it bouncing straight up!
            ball.setVelocityX(2 + Math.random() * 8);
        }
    }

    update ()
    {
        if (this.ball.y > 600)
        {
            this.resetBall();
        }
    }
}
const width = 384;//window.innerWidth;
const height = 576;//window.innerHeight;

const config = {
    type: Phaser.WEBGL,
    width: width,
    height: height,
    scale:{//배율설정
        mode:Phaser.Scale.FIT,//자동맞춤
        autoCenter:Phaser.Scale.CENTER_BOTH,//가로세로 모두맞춤
        width:width,//비율설정용 폭
        height:height,//비율설정용 높이
    },
    parent: 'phaser-example',
    scene: [ Breakout ],
    physics: {
        default: 'arcade'
    }
};

const game = new Phaser.Game(config);