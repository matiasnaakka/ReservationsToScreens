<script lang="ts">
  import type {Room} from '../../types/Room';
  import {onMount, onDestroy} from 'svelte';
  import {wingCoordsStore} from '../../stores/wingCoordsStore';
  import {createTextTexture} from '../../utils/createTextTexture';
  import {
    createMainDot,
    createPulse,
    createRing,
    createText
  } from '../../utils/pulsar';
  import {getRoomStatusColor} from '../../utils/getRoomStatusColor';
  import {createDirectionalArrow} from '../../utils/createDirectionalArrow';
  import {
    createToiletIcon,
    createElevatorIcon,
    createStairsIcon,
    createPantryIcon
  } from '../../utils/icons';
  import {createWingLetter} from '../../utils/icons/wingLetter';
  import {toiletCoordsStore} from '../../stores/toiletCoordsStore';
  import {elevatorCoordsStore} from '../../stores/elevatorCoordsStore';
  import {stairsCoordsStore} from '../../stores/stairsCoordsStore';
  import {pantryCoordsStore} from '../../stores/pantryCoordsStore';
  import {wallsStore} from '../../stores/wallsStore';
  import {createFloor} from '../../utils/createFloor';
  import CoordsOverlay from '../debug/CoordsOverlay.svelte';
  import {devMode} from '../../stores/devModeStore';
  import {gsap} from 'gsap';
  import {createQRCodeTexture} from '../../utils/createQRCodeTexture';
  // Keep "You are here" coordinates
  export let youAreHereCoordsX: number | null = null;
  export let youAreHereCoordsY: number | null = null;
  export let youAreHereFloorNum: number | null = null;

  // New prop for rooms array
  export let rooms: Room[] = [];

  // get the building code from first room
  export let building = rooms.length > 0 ? rooms[0].building : 'KM';

  // Add new prop for selected floor
  export let selectedFloor: number | null = null;

  let container: HTMLDivElement;
  let scene: any;
  let camera: any;
  let renderer: any;
  let animationFrameId: number;
  let THREE: any;
  let logoTexture: any;
  let logoMesh: any;
  let floorTextures: any[] = [];
  let currentFloorIndex = 0;
  const FLOOR_NUMBERS = [5, 6, 7];
  let isAnimating = true;
  let initialized = false;
  let floorInterval: ReturnType<typeof setInterval>;

  let targetCameraZ = 17;
  let cameraAnimationSpeed = 0.02;
  let isCameraAnimating = true;

  let locationDot: any;
  let isEnglish = true;
  let textMesh: any;
  let textInterval: ReturnType<typeof setInterval>;

  let roomBoxes: Map<string, any> = new Map();
  // Add screen size detection
  let screenScale = 1;
  const FULLHD_WIDTH = 1920;

  const updateScreenScale = () => {
    const width = window.innerWidth;
    screenScale = width < FULLHD_WIDTH ? width / FULLHD_WIDTH : 1;
  };

  const updateLocationText = () => {
    if (textMesh) {
      const newText = isEnglish ? 'You are here' : 'Olet tässä';
      textMesh.material.map = createTextTexture(newText);
      textMesh.material.needsUpdate = true;
      isEnglish = !isEnglish;
    }
  };

  // Add helper function to check if coordinates are valid
  const isValidCoordinate = (coord: number | null | undefined): boolean => {
    return coord !== null && coord !== undefined;
  };

  const areValidCoordinates = (): boolean => {
    // Check both coordinates and floor number match
    return (
      isValidCoordinate(youAreHereCoordsX) &&
      isValidCoordinate(youAreHereCoordsY) &&
      youAreHereFloorNum === FLOOR_NUMBERS[currentFloorIndex]
    );
  };

  // Add these to the component's state
  let coordsOverlayCamera: THREE.Camera | null = null;
  let coordsOverlayRenderer: THREE.WebGLRenderer | null = null;

  // Add accessor group property
  let accessoriesGroup: THREE.Group;

  async function initThree() {
    try {
      THREE = await import('three');
      const {TextureLoader} = THREE;
      const loader = new TextureLoader();

      scene = new THREE.Scene();
      // Load Metropolia logo texture
      logoTexture = await new Promise((resolve, reject) => {
        loader.load(
          'https://krugou.github.io/infoScreenProject/metropolialogo.png',
          resolve,
          undefined,
          reject
        );
      });

      // Load textures with floor info
      floorTextures = await Promise.all(
        FLOOR_NUMBERS.map(
          (floorNum) =>
            new Promise((resolve, reject) => {
              loader.load(
                `https://krugou.github.io/infoScreenProject/km${floorNum}.png`,
                (texture) => {
                  texture.minFilter = THREE.LinearFilter;
                  texture.magFilter = THREE.LinearFilter;
                  // Store floor number in texture
                  texture.userData = {floor: floorNum};
                  resolve(texture);
                },
                undefined,
                reject
              );
            })
        )
      );

      // Sort textures by floor number
      floorTextures.sort((a, b) => a.userData.floor - b.userData.floor);

      // Initialize currentFloorIndex based on selectedFloor if provided
      if (selectedFloor !== null) {
        currentFloorIndex = FLOOR_NUMBERS.indexOf(selectedFloor);
        if (currentFloorIndex === -1) {
          console.error(`Selected floor ${selectedFloor} not found`);
          currentFloorIndex = 0;
        }
      }

      if (container && floorTextures.length === FLOOR_NUMBERS.length) {
        init();
        initialized = true;
        animate();
      } else {
        throw new Error('Container or textures not ready');
      }
    } catch (error) {
      console.error('Failed to initialize Three.js:', error);
    }
  }

  const createRoomBox = (room: Room) => {
    if (!isValidCoordinate(room.x) || !isValidCoordinate(room.y)) {
      return null;
    }

    const boxGroup = new THREE.Group();
    // Add floor information to the group's userData
    boxGroup.userData = {
      key: room.key,
      floor: room.floor
    };

    // Background panel
    const boxGeometry = new THREE.PlaneGeometry(2, 1.8); // Made taller to accommodate QR code
    const boxMaterial = new THREE.MeshBasicMaterial({
      color: getRoomStatusColor(room.status),
      transparent: true,
      opacity: 0.9,
      side: THREE.DoubleSide
    });
    const boxMesh = new THREE.Mesh(boxGeometry, boxMaterial);

    // Room number text
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.width = 256;
    canvas.height = 128;
    if (!context) {
      return null;
    }
    context.fillStyle = '#ffffff';
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = '#000000';
    context.font = 'bold 3.5rem Roboto Slab';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText(room.key, canvas.width / 2, canvas.height / 2);

    const textTexture = new THREE.CanvasTexture(canvas);
    const textGeometry = new THREE.PlaneGeometry(1.8, 0.6);
    const textMaterial = new THREE.MeshBasicMaterial({
      map: textTexture,
      transparent: true,
      side: THREE.DoubleSide
    });
    const textMesh = new THREE.Mesh(textGeometry, textMaterial);
    textMesh.position.y = 0.5; // Moved up to make room for QR code
    textMesh.position.z = 0.01;
    // QR Code - using our new utility function
    const qrTexture = createQRCodeTexture(room.key);
    const qrGeometry = new THREE.PlaneGeometry(1, 1);
    const qrMaterial = new THREE.MeshBasicMaterial({
      map: qrTexture,
      transparent: true,
      side: THREE.DoubleSide
    });
    const qrMesh = new THREE.Mesh(qrGeometry, qrMaterial);
    qrMesh.position.y = -0.3; // Positioned below room number
    qrMesh.position.z = 0.02;

    boxGroup.add(boxMesh);
    boxGroup.add(textMesh);
    boxGroup.add(qrMesh);

    // Add directional arrow if specified
    if (room.directionArrow) {
      const arrow = createDirectionalArrow(
        room.directionArrow,
        room.arrowLength
      );
      boxGroup.add(arrow);
    }

    boxGroup.position.set(room.x, room.y, 0.1);
    // Set initial visibility based on current floor
    boxGroup.visible = room.floor === FLOOR_NUMBERS[currentFloorIndex];

    return boxGroup;
  };
  // @ts-expect-error - unused function
  let wingLetters: THREE.Group[] = [];

  let toiletIcons: Map<string, THREE.Group> = new Map();
  let elevatorIcons: Map<string, THREE.Group> = new Map();
  let stairsIcons: Map<string, THREE.Group> = new Map();
  let pantryIcons: Map<string, THREE.Group> = new Map();

  function init() {
    updateScreenScale();
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(
      60,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    renderer = new THREE.WebGLRenderer({antialias: true, alpha: true});
    renderer.setClearColor(0x000000, 0);
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);

    // Create the root group
    const rootGroup = new THREE.Group();
    scene.add(rootGroup);
    rootGroup.scale.set(screenScale, screenScale, 1);

    // Add ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 1);
    rootGroup.add(ambientLight);

    // Create accessories group
    accessoriesGroup = new THREE.Group();
    rootGroup.add(accessoriesGroup);

    // Add logo if texture is loaded
    if (logoTexture) {
      const logoGeometry = new THREE.PlaneGeometry(5, 1.5);
      const logoMaterial = new THREE.MeshBasicMaterial({
        map: logoTexture,
        transparent: true,
        side: THREE.DoubleSide
      });
      logoMesh = new THREE.Mesh(logoGeometry, logoMaterial);
      logoMesh.position.set(-5, 6.7, 0);
      accessoriesGroup.add(logoMesh);

      // Add floor number text
      const floorCanvas = document.createElement('canvas');
      const floorContext = floorCanvas.getContext('2d');
      floorCanvas.width = 512;
      floorCanvas.height = 128;
      if (floorContext) {
        floorContext.fillStyle = '#FF5000'; // Metropolia orange
        floorContext.font = 'bold 80px Roboto Slab';
        floorContext.textAlign = 'center';
        floorContext.textBaseline = 'middle';
        floorContext.fillText(
          `Floor ${FLOOR_NUMBERS[currentFloorIndex]}`,
          floorCanvas.width / 2,
          floorCanvas.height / 2
        );
      }

      const floorTexture = new THREE.CanvasTexture(floorCanvas);
      const floorTextGeometry = new THREE.PlaneGeometry(3, 0.8);
      const floorTextMaterial = new THREE.MeshBasicMaterial({
        map: floorTexture,
        transparent: true,
        opacity: 1.0,
        side: THREE.DoubleSide
      });
      const floorTextMesh = new THREE.Mesh(
        floorTextGeometry,
        floorTextMaterial
      );
      floorTextMesh.position.set(-5, 5.7, 0.1); // Position below logo
      floorTextMesh.material.opacity = 1.0; // Set opacity
      accessoriesGroup.add(floorTextMesh);

      // Store reference to floor text for updates
      logoMesh.userData.floorTextMesh = floorTextMesh;
      logoMesh.userData.floorCanvas = floorCanvas;
    }

    // Add floor textures
    floorTextures.forEach((texture, index) => {
      const floorNum = FLOOR_NUMBERS[index];
      const floorGeometry = new THREE.PlaneGeometry(16, 18);
      const floorMaterial = new THREE.MeshBasicMaterial({
        map: texture,
        transparent: false,
        side: THREE.DoubleSide,
        visible: floorNum === FLOOR_NUMBERS[currentFloorIndex]
      });
      const floorMesh = new THREE.Mesh(floorGeometry, floorMaterial);
      floorMesh.position.set(0, 0, 0);
      floorMesh.userData = {
        isFloor: true,
        floor: floorNum
      };
      // rootGroup.add(floorMesh);
    });

    // Add initial walls for current floor
    const initialFloor = FLOOR_NUMBERS[currentFloorIndex];
    const initialWalls = $wallsStore.find(
      (w) => w.building === building && w.floor === initialFloor
    );

    if (initialWalls?.walls) {
      const floorPlan = createFloor(initialWalls.walls);
      if (floorPlan) {
        floorPlan.userData = {
          isFloorPlan: true,
          floor: initialFloor
        };
        floorPlan.position.z = 0.02;
        rootGroup.add(floorPlan);

        // // Optional: Add a subtle scale animation to the entire floor plan
        // floorPlan.scale.set(0.95, 0.95, 1);
        // gsap.to(floorPlan.scale, {
        //   x: 1,
        //   y: 1,
        //   duration: 1,
        //   ease: 'elastic.out(1, 0.5)'
        // });
      }
    }

    // Add location dot if coordinates are valid
    if (areValidCoordinates()) {
      locationDot = new THREE.Group();
      const mainDot = createMainDot();
      const ring = createRing();
      const pulse = createPulse();
      const text = createText();
      locationDot.add(mainDot, ring, pulse, text);
      locationDot.position.set(youAreHereCoordsX!, youAreHereCoordsY!, 0.1);
      accessoriesGroup.add(locationDot);
    }

    // Initialize accessories
    updateAccessories();

    // Set camera
    camera.position.set(0, 0, targetCameraZ);
    camera.lookAt(0, 0, 0);

    // Initialize dev mode if needed
    if ($devMode) {
      const coordsOverlay = container.querySelector('coords-overlay');
      if (coordsOverlay) {
        coordsOverlay.initRaycaster(camera, renderer);
      }
    }

    // Store references for overlay
    coordsOverlayCamera = camera;
    coordsOverlayRenderer = renderer;
  }

  // New function to update accessories
  const updateAccessories = () => {
    // Clear existing accessories except logo and location dot
    accessoriesGroup.children
      .filter((child) => {
        // Ensure we keep both logoMesh and locationDot
        return child !== logoMesh && child !== locationDot;
      })
      .forEach((child) => {
        accessoriesGroup.remove(child);
        child.traverse((object: any) => {
          if (object.material) object.material.dispose();
          if (object.geometry) object.geometry.dispose();
        });
      });

    // Make sure locationDot is visible if it should be on this floor
    if (locationDot) {
      const isCurrentFloor =
        youAreHereFloorNum === FLOOR_NUMBERS[currentFloorIndex];
      locationDot.visible = isCurrentFloor && areValidCoordinates();
    } else {
      locationDot = new THREE.Group();
      const mainDot = createMainDot();
      const ring = createRing();
      const pulse = createPulse();
      const text = createText();
      locationDot.add(mainDot, ring, pulse, text);
      locationDot.position.set(youAreHereCoordsX!, youAreHereCoordsY!, 0.1);
      accessoriesGroup.add(locationDot);
    }

    // Add room boxes
    rooms.forEach((room) => {
      const roomBox = createRoomBox(room);
      if (roomBox) {
        roomBoxes.set(room.key, roomBox);
        accessoriesGroup.add(roomBox);
      }
    });

    // Add wing letters
    const buildingWings = $wingCoordsStore[building] || [];
    buildingWings.forEach(({letter, x, y}) => {
      const wingLetter = createWingLetter(letter, {x, y});
      if (wingLetter) {
        wingLetters.push(wingLetter);
        accessoriesGroup.add(wingLetter);
      }
    });

    // Add icons for current floor
    const currentFloor = FLOOR_NUMBERS[currentFloorIndex];

    // Add toilet icons
    $toiletCoordsStore.forEach((toilet) => {
      if (toilet.building === building && toilet.floor === currentFloor) {
        const toiletIcon = createToiletIcon(
          toilet.type,
          toilet.isHandicapAccessible
        );
        toiletIcon.position.set(toilet.x, toilet.y, 0.1);
        toiletIcons.set(toilet.key, toiletIcon);
        accessoriesGroup.add(toiletIcon);
      }
    });

    // Add elevator icons
    $elevatorCoordsStore.forEach((elevator) => {
      if (elevator.building === building && elevator.floor === currentFloor) {
        const elevatorIcon = createElevatorIcon();
        elevatorIcon.position.set(elevator.x, elevator.y, 0.1);
        elevatorIcons.set(elevator.key, elevatorIcon);
        accessoriesGroup.add(elevatorIcon);
      }
    });

    // Add stairs icons
    $stairsCoordsStore.forEach((stairs) => {
      if (stairs.building === building && stairs.floor === currentFloor) {
        const stairsIcon = createStairsIcon(stairs.isEmergencyExit);
        stairsIcon.position.set(stairs.x, stairs.y, 0.1);
        stairsIcons.set(stairs.key, stairsIcon);
        accessoriesGroup.add(stairsIcon);
      }
    });

    // Add pantry icons
    $pantryCoordsStore.forEach((pantry) => {
      if (pantry.building === building && pantry.floor === currentFloor) {
        const pantryIcon = createPantryIcon();
        pantryIcon.position.set(pantry.x, pantry.y, 0.1);
        pantryIcons.set(pantry.key, pantryIcon);
        accessoriesGroup.add(pantryIcon);
      }
    });

    updateAccessoriesVisibility();
  };

  function toggleAnimation() {
    isAnimating = !isAnimating;
    if (isAnimating) {
      animate();
    } else if (animationFrameId) {
      cancelAnimationFrame(animationFrameId);
    }
  }
  // here is the animation function
  function animate() {
    if (!initialized || !scene) return;

    animationFrameId = requestAnimationFrame(animate);
    const time = Date.now() * 0.001;

    // Simple camera zoom animation
    if (isCameraAnimating && camera) {
      const distance = targetCameraZ - camera.position.z;
      if (Math.abs(distance) > 0.01) {
        camera.position.z += distance * cameraAnimationSpeed;
      } else {
        isCameraAnimating = false;
        camera.position.z = targetCameraZ;
      }
    }

    if (isAnimating && logoMesh) {
      // Simple logo hover animation
      logoMesh.position.y = 6.7 + Math.sin(Date.now() * 0.001) * 0.1;
      logoMesh.rotation.z = Math.sin(Date.now() * 0.0001) * 0.01;
      // Add null check for wingLetters
      if (wingLetters && wingLetters.length > 0) {
        wingLetters.forEach((letter, index) => {
          if (letter) {
            letter.rotation.z = Math.sin(Date.now() * 0.0005 + index) * 0.01;
          }
        });
      }
      // Additional scaling effect for logo
      const scale = 1 + Math.sin(Date.now() * 0.0005) * 0.01;
      logoMesh.scale.set(scale, scale, scale);
    }

    if (isAnimating && locationDot) {
      const pulse = locationDot.children[2];
      if (pulse) {
        const pulseScale = 1 + Math.sin(time * 1.2) * 0.2;
        pulse.scale.set(pulseScale, pulseScale, 1);
        if (pulse.material) {
          pulse.material.opacity = 0.3 * (1 - Math.sin(time * 2) * 0.2);
        }
      }

      const ring = locationDot.children[1];
      if (ring) {
        ring.rotation.z = time * 0.5;
      }
    }

    if (isAnimating) {
      const time = Date.now() * 0.001;
      rooms.forEach((room) => {
        const box = roomBoxes.get(room.key);
        if (box && box.visible) {
          box.position.y = room.y + Math.sin(time * 0.001) * 0.05;
        }
      });

      // Animate toilet icons
      toiletIcons.forEach((icon) => {
        if (icon.visible) {
          // Pulsing glow effect
          const glowScale = 1 + Math.sin(time * 2 + icon.animationPhase) * 0.1;
          icon.glowMesh.scale.set(glowScale, glowScale, 1);
          icon.glowMesh.material.opacity =
            0.3 + Math.sin(time * 2 + icon.animationPhase) * 0.1;

          // Gentle hover effect
          icon.position.y += Math.sin(time + icon.animationPhase) * 0.0005;
        }
      });

      // Animate elevator icons
      elevatorIcons.forEach((icon) => {
        if (icon.visible) {
          // Pulsing scale
          const scale = 1 + Math.sin(time * 3 + icon.animationPhase) * 0.05;
          icon.scale.set(scale, scale, 1);

          // Opacity animation for glow
          icon.glowMesh.material.opacity =
            0.3 + Math.sin(time * 2 + icon.animationPhase) * 0.1;
        }
      });

      // Animate stairs icons
      stairsIcons.forEach((icon) => {
        if (icon.visible) {
          // Pulsing glow effect
          const glowScale = 1 + Math.sin(time * 2 + icon.animationPhase) * 0.1;
          icon.glowMesh.scale.set(glowScale, glowScale, 1);
          icon.glowMesh.material.opacity =
            0.3 + Math.sin(time * 2 + icon.animationPhase) * 0.1;

          // Gentle hover effect
          icon.position.y += Math.sin(time + icon.animationPhase) * 0.0005;
        }
      });

      // Animate pantry icons
      pantryIcons.forEach((icon) => {
        if (icon.visible) {
          const glowScale = 1 + Math.sin(time * 2 + icon.animationPhase) * 0.1;
          icon.glowMesh.scale.set(glowScale, glowScale, 1);
          icon.glowMesh.material.opacity =
            0.3 + Math.sin(time * 2 + icon.animationPhase) * 0.1;
          icon.position.y += Math.sin(time + icon.animationPhase) * 0.0005;
        }
      });
    }

    if (renderer && scene && camera) {
      renderer.render(scene, camera);
    }
  }

  function handleResize() {
    if (camera && renderer && container) {
      updateScreenScale();
      // Update root group scale instead of scene
      const rootGroup = scene.children[0];
      if (rootGroup) {
        rootGroup.scale.set(screenScale, screenScale, 1);
      }
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    }
  }

  onMount(() => {
    if (container) {
      initThree();
      window.addEventListener('resize', handleResize);
      if (!selectedFloor) {
        startFloorInterval();
      }
      textInterval = setInterval(updateLocationText, 5000);
    }
  });

  onDestroy(() => {
    window.removeEventListener('resize', handleResize);
    if (renderer) {
      renderer.dispose();
    }
    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId);
    }
    if (floorInterval) {
      clearInterval(floorInterval);
    }
    if (textInterval) {
      clearInterval(textInterval);
    }
    roomBoxes.forEach((box) => {
      scene.remove(box);
      box.traverse((child: any) => {
        if (child.material) child.material.dispose();
        if (child.geometry) child.geometry.dispose();
      });
    });

    // Clean up wing letters
    wingLetters.forEach((letter) => {
      scene.remove(letter);
      letter.traverse((child: any) => {
        if (child.material) child.material.dispose();
        if (child.geometry) child.geometry.dispose();
      });
    });

    toiletIcons.forEach((icon) => {
      scene.remove(icon);
      icon.traverse((child: any) => {
        if (child.material) child.material.dispose();
        if (child.geometry) child.geometry.dispose();
      });
    });

    elevatorIcons.forEach((icon) => {
      scene.remove(icon);
      icon.traverse((child: any) => {
        if (child.material) child.material.dispose();
        if (child.geometry) child.geometry.dispose();
      });
    });

    // Clean up stairs icons
    stairsIcons.forEach((icon) => {
      scene.remove(icon);
      icon.traverse((child: any) => {
        if (child.material) child.material.dispose();
        if (child.geometry) child.geometry.dispose();
      });
    });

    // Clean up pantry icons
    pantryIcons.forEach((icon) => {
      scene.remove(icon);
      icon.traverse((child: any) => {
        if (child.material) child.material.dispose();
        if (child.geometry) child.geometry.dispose();
      });
    });

    if (accessoriesGroup) {
      accessoriesGroup.traverse((child: any) => {
        if (child.material) child.material.dispose();
        if (child.geometry) child.geometry.dispose();
      });
      scene.remove(accessoriesGroup);
    }
  });

  // Add function to change floor
  function changeFloor() {
    if (!scene) return;

    const previousFloorIndex = currentFloorIndex;

    if (selectedFloor !== null) {
      const newIndex = FLOOR_NUMBERS.indexOf(selectedFloor);
      if (newIndex === -1) {
        console.error(`Invalid floor selected: ${selectedFloor}`);
        return;
      }
      currentFloorIndex = newIndex;
    } else {
      currentFloorIndex = (currentFloorIndex + 1) % FLOOR_NUMBERS.length;
    }

    const currentFloor = FLOOR_NUMBERS[currentFloorIndex];
    console.log('Changing to floor:', currentFloor);

    // Get the root group
    const rootGroup = scene.children[0];

    // Update floor textures visibility
    rootGroup.children
      .filter((child) => child.userData?.isFloor)
      .forEach((floorMesh) => {
        if (floorMesh.material) {
          floorMesh.material.visible =
            floorMesh.userData.floor === currentFloor;
        }
      });

    // Remove ALL existing floor plans
    const existingPlans = rootGroup.children.filter(
      (child) => child.userData?.isFloorPlan
    );
    existingPlans.forEach((plan) => {
      rootGroup.remove(plan);
      plan.traverse((obj: any) => {
        if (obj.material) {
          if (Array.isArray(obj.material)) {
            obj.material.forEach((m) => m.dispose());
          } else {
            obj.material.dispose();
          }
        }
        if (obj.geometry) obj.geometry.dispose();
      });
    });

    // Load walls for current floor
    const floorWalls = $wallsStore.find(
      (w) => w.building === building && w.floor === currentFloor
    );

    if (floorWalls?.walls) {
      console.log('Creating walls for floor:', currentFloor);
      const floorPlan = createFloor(floorWalls.walls);
      if (floorPlan) {
        floorPlan.userData = {
          isFloorPlan: true,
          floor: currentFloor
        };
        floorPlan.position.z = 0.02;
        rootGroup.add(floorPlan);
        console.log('Added floor plan for floor:', currentFloor);
      }
    } else {
      console.warn('No walls found for floor:', currentFloor);
    }

    // Update other elements
    updateRoomBoxesVisibility();
    updateDotPosition();
    updateIconsVisibility();
    updateAccessories();

    // Update floor number text
    if (logoMesh?.userData.floorTextMesh && logoMesh.userData.floorCanvas) {
      const floorContext = logoMesh.userData.floorCanvas.getContext('2d');
      if (floorContext) {
        floorContext.clearRect(
          0,
          0,
          logoMesh.userData.floorCanvas.width,
          logoMesh.userData.floorCanvas.height
        );
        floorContext.fillStyle = '#FF5000';
        floorContext.font = 'bold 80px Roboto Slab';
        floorContext.textAlign = 'center';
        floorContext.textBaseline = 'middle';
        floorContext.fillText(
          `Floor ${currentFloor}`,
          logoMesh.userData.floorCanvas.width / 2,
          logoMesh.userData.floorCanvas.height / 2
        );
        logoMesh.userData.floorTextMesh.material.map.needsUpdate = true;
      }
    }

    // Force a render update
    if (renderer) {
      renderer.render(scene, camera);
    }
  }

  // Add this function to handle automatic floor switching
  const startFloorInterval = () => {
    if (selectedFloor) {
      // If a floor is selected, don't start the interval
      return;
    }
    floorInterval = setInterval(() => {
      changeFloor();
    }, 15000);
  };

  // Modify handleClick to also change floor
  function handleClick() {
    toggleAnimation();
    changeFloor();
    // Reset the interval to prevent quick transitions
    if (floorInterval) {
      clearInterval(floorInterval);
    }
    startFloorInterval();
  }

  // Modify updateDotPosition to handle visibility
  function updateDotPosition() {
    console.log('Updating dot position');
    console.log(locationDot);
    if (!locationDot) return;
    console.log('Location dot exists');
    const isCurrentFloor =
      youAreHereFloorNum === FLOOR_NUMBERS[currentFloorIndex];
    if (areValidCoordinates() && isCurrentFloor) {
      locationDot.visible = true;
      locationDot.position.x = youAreHereCoordsX!;
      locationDot.position.y = youAreHereCoordsY!;
      const textMesh = locationDot.children[3];
      if (textMesh) {
        textMesh.rotation.z = 0;
      }
    } else {
      locationDot.visible = false;
    }
  }

  // Update room box visibility when floor changes
  function updateRoomBoxesVisibility() {
    const currentFloor = FLOOR_NUMBERS[currentFloorIndex];
    roomBoxes.forEach((box, key) => {
      const room = rooms.find((r) => r.key === key);
      if (room) {
        // Explicitly check if the room's floor matches current floor
        const shouldBeVisible = room.floor === currentFloor;
        if (box.visible !== shouldBeVisible) {
          box.visible = shouldBeVisible;
          // Update children visibility
          box.traverse((child: any) => {
            if (child !== box) {
              // Don't update the box itself again
              child.visible = shouldBeVisible;
            }
          });
        }
      }
    });
  }

  function updateIconsVisibility() {
    const currentFloor = FLOOR_NUMBERS[currentFloorIndex];

    toiletIcons.forEach((icon, key) => {
      const toilet = $toiletCoordsStore.find((t) => t.key === key);
      if (toilet) {
        icon.visible = toilet.floor === currentFloor;
      }
    });

    elevatorIcons.forEach((icon, key) => {
      const elevator = $elevatorCoordsStore.find((e) => e.key === key);
      if (elevator) {
        icon.visible = elevator.floor === currentFloor;
      }
    });

    // Update stairs visibility
    stairsIcons.forEach((icon, key) => {
      const stairs = $stairsCoordsStore.find((s) => s.key === key);
      if (stairs) {
        icon.visible = stairs.floor === currentFloor;
      }
    });

    // Update pantry visibility
    pantryIcons.forEach((icon, key) => {
      const pantry = $pantryCoordsStore.find((p) => p.key === key);
      if (pantry) {
        icon.visible = pantry.floor === currentFloor;
      }
    });
  }

  function updateAccessoriesVisibility() {
    const currentFloor = FLOOR_NUMBERS[currentFloorIndex];

    accessoriesGroup.children.forEach((child) => {
      // Skip logo and location dot
      if (child === logoMesh || child === locationDot) return;

      // Handle room boxes
      if (roomBoxes.has(child.userData.key)) {
        const room = rooms.find((r) => r.key === child.userData.key);
        child.visible = room?.floor === currentFloor;
      }

      // Handle icons
      const isIcon =
        toiletIcons.has(child.userData.key) ||
        elevatorIcons.has(child.userData.key) ||
        stairsIcons.has(child.userData.key) ||
        pantryIcons.has(child.userData.key);

      if (isIcon) {
        child.visible = child.userData.floor === currentFloor;
      }
    });
  }

  $: {
    if (initialized && locationDot) {
      updateDotPosition();
    }
  }

  // Update room boxes when room data changes
  $: if (initialized && rooms) {
    updateRoomBoxes(rooms);
  }

  // Add reactive statement for selectedFloor changes
  $: if (initialized && selectedFloor !== null) {
    if (floorInterval) {
      clearInterval(floorInterval);
    }
    // Ensure scene is ready before changing floor
    if (scene) {
      changeFloor();
    }
  }

  function updateRoomBoxes(newRooms: Room[]) {
    // First, remove existing room boxes properly
    roomBoxes.forEach((box) => {
      accessoriesGroup.remove(box);
      box.traverse((child: any) => {
        if (child.material) {
          if (Array.isArray(child.material)) {
            child.material.forEach((m) => m.dispose());
          } else {
            child.material.dispose();
          }
        }
        if (child.geometry) child.geometry.dispose();
      });
    });
    roomBoxes.clear();

    // Create new room boxes
    newRooms.forEach((room) => {
      const roomBox = createRoomBox(room);
      if (roomBox) {
        roomBoxes.set(room.key, roomBox);
        accessoriesGroup.add(roomBox);
      }
    });

    // Update visibility for current floor
    const currentFloor = FLOOR_NUMBERS[currentFloorIndex];
    roomBoxes.forEach((box, key) => {
      const room = newRooms.find((r) => r.key === key);
      if (room) {
        box.visible = room.floor === currentFloor;
      }
    });
  }
  const ifModeisDevelopment = import.meta.env.MODE === 'development';
</script>

<div
  bind:this={container}
  class="relative h-screen w-full cursor-pointer bg-transparent"
  role="button"
  tabindex="0"
  on:click={handleClick}
  on:keydown={(e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      handleClick();
    }
  }}
>
  {#if initialized && ifModeisDevelopment}
    <CoordsOverlay
      {container}
      camera={coordsOverlayCamera}
      renderer={coordsOverlayRenderer}
    />
  {/if}
</div>

<style>
  div {
    position: relative;
    overflow: hidden;
  }
</style>
